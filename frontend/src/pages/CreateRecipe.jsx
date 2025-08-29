import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { Plus, X, Utensils, Layers, ChefHat, Gauge } from "lucide-react";

const commonIngredients = [
  "Onion",
  "Tomato",
  "Garlic",
  "Ginger",
  "Potato",
  "Spinach",
  "Carrot",
  "Chicken",
  "Paneer",
  "Milk",
  "Rice",
  "Flour",
  "Butter",
  "Cheese",
];

const CreateRecipe = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [ingredients, setIngredients] = useState([""]);
  const [portionSize, setPortionSize] = useState("");
  const [category, setCategory] = useState("vegetarian");
  const [difficulty, setDifficulty] = useState("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    if (ingredients.length > 10) {
      setError("You can add at most 10 ingredients");
      return;
    }
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (ingredients.length < 3) {
      setError("You must add at least 3 ingredients.");
      return;
    }

    if (
      ingredients.some((ing) => !ing.trim()) ||
      !portionSize.trim() ||
      !category.trim() ||
      !difficulty.trim()
    ) {
      setError("Please fill all fields and make sure ingredients are not empty.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/api/recipe/`, {
        ingredients,
        portionSize,
        category,
        difficulty,
      },
        { withCredentials: true }
      );

      console.log(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 p-6">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg shadow-xl rounded-3xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-800 flex items-center justify-center gap-2">
          <ChefHat className="w-8 h-8 text-purple-600" />
          Create a New Recipe
        </h1>

        {error && (
          <p className="text-red-500 mb-4 font-semibold bg-red-100 p-3 rounded-lg text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredients */}
          <div>
            <label className=" font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <Utensils className="w-5 h-5 text-purple-600" /> Ingredients (min 3):
            </label>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  list="ingredient-suggestions"
                  placeholder="Enter ingredient"
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <datalist id="ingredient-suggestions">
              {commonIngredients.map((item, i) => (
                <option key={i} value={item} />
              ))}
            </datalist>

            <button
              type="button"
              onClick={addIngredient}
              className="mt-3 flex items-center gap-1 text-sm text-purple-700 hover:underline"
              disabled={ingredients.length > 10}
            >
              <Plus className="w-4 h-4" /> Add Ingredient
            </button>
          </div>

          {/* Portion Size */}
          <div>
            <label className=" font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <Layers className="w-5 h-5 text-purple-600" /> Portion Size:
            </label>
            <input
              type="text"
              value={portionSize}
              onChange={(e) => setPortionSize(e.target.value)}
              placeholder="e.g., 4 servings"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50"
            />
          </div>

          {/* Category */}
          <div>
            <label className=" font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <ChefHat className="w-5 h-5 text-purple-600" /> Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50"
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className=" font-semibold mb-2 flex items-center gap-2 text-gray-700">
              <Gauge className="w-5 h-5 text-purple-600" /> Difficulty:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold p-3 rounded-xl hover:bg-purple-800 transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
