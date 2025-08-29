import { Link, useNavigate } from "react-router-dom";
import { Trash2, Heart } from "lucide-react";
import axios from "axios";
import { useState } from "react";

const RecipeCard = ({ recipe, onDelete, user }) => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const category = String(recipe.category || "").toLowerCase();
  const isVeg = category.includes("veg");
  const [success, setSuccess] = useState("");
  const [saved, setSaved] = useState(recipe.userSaved || false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axios.delete(`${baseUrl}/api/recipe/${recipe._id}`, { withCredentials: true });
      setSuccess("Recipe deleted successfully");
      if (onDelete) onDelete(recipe._id);
      navigate("/");
    } catch (err) {
      setSuccess(err.response?.data?.message || "Failed to delete recipe");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved || loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/recipe/${recipe._id}/save`,
        {},
        { withCredentials: true }
      );
      setSaved(true);
      alert(response.data.message || "Recipe saved!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group w-full max-w-sm rounded-3xl overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <Link to={`/recipe/${recipe._id}`} className="block relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-t-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-t-3xl"></div>
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
            isVeg ? "bg-green-500 text-white" : "bg-orange-500 text-white"
          }`}
        >
          {recipe.category}
        </span>
      </Link>

      <div className="p-5 flex flex-col gap-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{recipe.title}</h2>
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              saved ? "bg-green-500 hover:bg-green-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <Heart size={16} className={saved ? "text-red-500" : "text-white"} />
            {saved ? "Saved" : "Save"}
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {success && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-md text-sm animate-fade-in">
          {success}
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
