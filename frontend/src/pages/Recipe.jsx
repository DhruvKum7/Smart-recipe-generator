import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from 'react-markdown'
import {
  BookOpen,
  Star,
  List,
  UtensilsCrossed,
  Utensils,
  AlertTriangle,
  Loader2,
  Edit3,
  Check,
  ImagePlus,
} from "lucide-react";

const Recipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [imgLoading, setImgLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/recipe/${id}`);
        setRecipe(res.data.recipe);
        setFormData(res.data.recipe);
      } catch (err) {
        setError(err.message || "Failed to fetch recipe");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, baseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value.split("\n") }));
  };

  const handleNutritionChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      nutritionalInfo: { ...prev.nutritionalInfo, [name]: value },
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${baseUrl}/api/recipe/${id}`, formData);
      setRecipe(res.data.recipe);
      setEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update recipe");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" size={24} /> Loading recipe...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center mt-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 shadow">
          <AlertTriangle size={20} /> {error}
        </div>
      </div>
    );

  if (!recipe) return null;

  const handleGenerateImage = async () => {
    try {
      setImgLoading(true);
      const res = await axios.post(`${baseUrl}/api/recipe/${id}/generate-image`);
      setRecipe(res.data.recipe); // update recipe with new image
    } catch (err) {
      setError(err.message || "Failed to generate image");
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold text-amber-600 flex items-center gap-3 uppercase">
          {recipe.title}
        </h1>
        <button
          onClick={() => setEditing((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-1 rounded shadow hover:brightness-90 ${editing
            ? "bg-teal-500 text-white"
            : "bg-yellow-500 text-white"
            }`}
        >
          {editing ? <Check size={16} /> : <Edit3 size={16} />}
          {editing ? "Save" : "Edit"}
        </button>
      </div>

      {editing ? (
        <div className="space-y-4 mb-8">

          <textarea
            name="description"
            value={formData.description.join("\n")}
            onChange={(e) => handleArrayChange("description", e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Description (one per line)"
          />

          <textarea
            name="ingredients"
            value={formData.ingredients.join("\n")}
            onChange={(e) => handleArrayChange("ingredients", e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Ingredients (one per line)"
          />

          <textarea
            name="instructions"
            value={formData.instructions.join("\n")}
            onChange={(e) => handleArrayChange("instructions", e.target.value)}
            className="w-full p-2 border rounded"
            rows={6}
            placeholder="Instructions (one per line)"
          />

          <input
            type="text"
            name="portionSize"
            value={formData.portionSize}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Portion Size"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mt-4 cursor-pointer
            transition-all dura"
          >
            Update Recipe
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 text-gray-700 text-sm mb-8">
            <p className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
              <BookOpen size={16} /> {recipe.category.join(", ")}
            </p>
            <p className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
              <Star size={16} className="text-yellow-500" /> {recipe.difficulty}
            </p>
            <p className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <UtensilsCrossed size={16} /> Serves: {recipe.portionSize}
            </p>
          </div>

          {recipe.description && (
            <div className="bg-teal-50 border-2 border-teal-500 p-5 rounded-lg shadow mb-8">
              {Array.isArray(recipe.description)
                ? recipe.description.map((d, i) => (
                  <p key={i} className="text-gray-700 mb-2">{d}</p>
                ))
                : <p className="text-gray-700">{recipe.description}</p>}
            </div>
          )}


          <div className="mb-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
              <List size={24} className="text-green-600" /> Ingredients
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="capitalize">{ing}</li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
              <Utensils size={22} className="text-green-600" /> Instructions
            </h2>
            <ol className="space-y-3 text-gray-800">
              {recipe.instructions.map((step, idx) => (
                <li key={idx}><Markdown>{step}</Markdown></li>
              ))}
            </ol>
          </div>

          {/* Nutrition */}
          {recipe.nutritionalInfo && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                Nutrition Information
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-800">
                <div className="bg-yellow-200 text-yellow-800 p-4 rounded-lg text-center shadow">
                  <p className="font-medium">Calories</p>
                  <p className="text-lg font-bold">{recipe.nutritionalInfo.calories} kcal</p>
                </div>
                <div className="bg-green-200 text-green-800 p-4 rounded-lg text-center shadow">
                  <p className="font-medium">Protein</p>
                  <p className="text-lg font-bold">{recipe.nutritionalInfo.protein} g</p>
                </div>
                <div className="bg-red-200 text-red-800 p-4 rounded-lg text-center shadow">
                  <p className="font-medium">Fat</p>
                  <p className="text-lg font-bold">{recipe.nutritionalInfo.fat} g</p>
                </div>
                <div className="bg-blue-200 text-blue-800 p-4 rounded-lg text-center shadow">
                  <p className="font-medium">Carbs</p>
                  <p className="text-lg font-bold">{recipe.nutritionalInfo.carbs} g</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* <button
        onClick={handleGenerateImage}
        disabled={imgLoading}
        className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-60"
      >
        {imgLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <ImagePlus className="w-5 h-5" />}
        {imgLoading ? "Generating..." : "Generate Image"}
      </button> */}
    </div >
  );
};

export default Recipe;
