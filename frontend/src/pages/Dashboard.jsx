import { useAuthStore } from "../store/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import { Search } from "lucide-react";

export const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("");

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/recipe`, { withCredentials: true });
        setRecipes(res.data.recipes);
      } catch (err) {
        setError(err.message || "Failed to fetch recipes");
      }
    };
    getRecipes();
  }, [baseUrl]);

  if (!user) return <p>Loading...</p>;

  // Extract unique tags
  const allTags = ["All", ...new Set(recipes.map((r) => r.category))];

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedTag === "All" || recipe.category === selectedTag;
    const matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter;
    const matchesTime = !maxTime || recipe.cookingTime <= maxTime;
    const matchesDietary = !dietaryFilter || recipe.category.includes(dietaryFilter);
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTime && matchesDietary;
  });

  return (
    <div className="p-6 bg-teal-50 min-h-screen">
      {error && <p className="text-red-500">{error}</p>}

      {/* Search Bar */}
      <div className="relative w-full mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-200 pl-10 pr-4 py-2 border-none rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none outline-none bg-white"
        />
      </div>

      {/* Recipes */}
      {filteredRecipes.length === 0 ? (
        <p className="text-gray-500">No recipes found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              user={user}
              onDelete={(id) => setRecipes(recipes.filter(r => r._id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
