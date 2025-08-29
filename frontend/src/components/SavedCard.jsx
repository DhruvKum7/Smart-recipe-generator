import React from "react";
import { Link } from "react-router-dom";

const SavedCard = ({ recipe }) => {
  const category = String(recipe.category || "").toLowerCase();
  const isVeg = category.includes("veg");

  return (
    <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <Link to={`/recipe/${recipe._id}`} className="block relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-t-3xl transition-transform duration-300 hover:scale-105"
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

      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{recipe.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{recipe.description?.[0]}</p>
      </div>
    </div>
  );
};

export default SavedCard;
