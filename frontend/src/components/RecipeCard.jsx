import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useState } from "react";

const RecipeCard = ({ recipe, onDelete }) => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const category = String(recipe.category || "").toLowerCase();
  const isVeg = category.includes("veg"); 
  const [success, setSuccess] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await axios.delete(`${baseUrl}/api/recipe/${recipe._id}`);
      setSuccess("Recipe deleted successfully");
      if (onDelete) onDelete(recipe._id); // update parent list
      navigate("/");
    } catch (err) {
      setSuccess(err.response?.data?.message || "Failed to delete recipe");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="relative group w-full max-w-sm h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <Link to={`/recipe/${recipe._id}`} className="block w-full h-full">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

        <div className="absolute top-3 left-3">
          <span
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow-md ${
              isVeg ? "bg-green-600 text-white" : "bg-blue-600 text-white"
            }`}
          >
            {recipe.category}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-lg font-bold drop-shadow-md">{recipe.title}</h2>
        </div>
      </Link>

      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 bg-red-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
      >
        <Trash2 size={16} />
      </button>

      {success && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-md text-sm">
          {success}
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
