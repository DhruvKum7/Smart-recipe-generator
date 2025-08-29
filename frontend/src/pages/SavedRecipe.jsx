import React, { useEffect, useState } from "react";
import axios from "axios";
import SavedCard from "../components/SavedCard";

const SavedRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/recipe/recipe-saved`, { withCredentials: true });
      setRecipes(response.data.recipes);
      console.log(response.data.recipes);
    
    } catch (err) {
      console.error("Failed to fetch saved recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchSavedRecipes();
}, []);
  if (loading) return <div className="text-center p-5">Loading saved recipes...</div>;
  if (recipes.length === 0) return <div className="text-center p-5">No saved recipes yet.</div>;

  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <SavedCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
};

export default SavedRecipe;
