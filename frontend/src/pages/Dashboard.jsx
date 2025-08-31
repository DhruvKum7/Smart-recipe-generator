// Dashboard.jsx
import { useAuthStore } from "../store/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";
import { Search } from "lucide-react";

const Dashboard = () => {
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

  if (!user) return <p className="p-8 text-center text-gray-500">Loading...</p>;

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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 px-6 py-10">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          {/* Search */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 shadow-md backdrop-blur focus:ring-2 focus:ring-teal-400 focus:outline-none transition"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category */}
            <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/80 shadow-sm backdrop-blur text-sm focus:ring-2 focus:ring-teal-400"
            >
              {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
              ))}
            </select>

            {/* Difficulty */}
            <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/80 shadow-sm backdrop-blur text-sm focus:ring-2 focus:ring-teal-400"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Time */}
            <input
                type="number"
                value={maxTime}
                onChange={(e) => setMaxTime(e.target.value)}
                placeholder="Max time (min)"
                className="px-3 py-2 rounded-lg bg-white/80 shadow-sm backdrop-blur text-sm focus:ring-2 focus:ring-teal-400 w-28"
            />

            {/* Dietary */}
            <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/80 shadow-sm backdrop-blur text-sm focus:ring-2 focus:ring-teal-400"
            >
              <option value="">All Diets</option>
              <option value="Vegan">Vegan</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>
        </div>

        {/* Recipes */}
        {filteredRecipes.length === 0 ? (
            <p className="text-gray-500 text-center">No recipes found 🥲</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                  <div
                      key={recipe._id}
                      className="transform hover:scale-[1.02] transition duration-200"
                  >
                    <RecipeCard
                        recipe={recipe}
                        user={user}
                        onDelete={(id) => setRecipes(recipes.filter((r) => r._id !== id))}
                    />
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default Dashboard;
