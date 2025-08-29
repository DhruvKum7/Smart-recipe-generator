import Recipe from "../models/Recipe.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.model.js";
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";
import { jsonrepair } from "jsonrepair";

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({
      message: "Here are the recipes",
      recipes,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in finding recipes",
      error,
    });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params; // extracting recipe id from URL
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      message: "Here is the recipe",
      recipe,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in finding recipe",
      error,
    });
  }
};

export const createRecipe = async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "GOOGLE_API_KEY not found" });

  try {
    const { ingredients, portionSize, category, difficulty } = req.body;

    const prompt = `
      Generate a detailed recipe with the following details:
      - Portion size: ${portionSize}
      - Category: ${category}
      - Difficulty: ${difficulty}
      - Ingredients: ${ingredients.join(", ")}

      Format the response as **valid JSON** only, including nested nutritionalInfo object:
      {
        "title": "Recipe title",
        "description": ["bullet point 1", "bullet point 2"],
        "ingredients": [{ "item": "x", "amount": "y", "unit": "z" }],
        "instructions": ["step 1", "step 2", "step 3"],
        "nutritionalInfo": { "calories": 0, "protein": 0, "fat": 0, "carbs": 0 }
      }
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const aiText = await result.response.text();

    // Remove markdown ```json if any
    const cleanText = aiText.replace(/```json|```/g, "").trim();

    let parsedRecipe;
    try {
      const repaired = jsonrepair(cleanText); // 👈 fixes invalid JSON
      parsedRecipe = JSON.parse(repaired);
    } catch (err) {
      console.error("JSON Repair failed:", err.message);
      return res
        .status(500)
        .json({ error: "AI response JSON invalid", raw: aiText });
    }

    const formattedIngredients = parsedRecipe.ingredients.map((i) =>
      typeof i === "string" ? i : `${i.amount || ""} ${i.unit || ""} ${i.item}`
    );

    const parseNutrition = (value) => {
      if (!value) return 0;
      const num = parseFloat(value.toString().replace(/[^\d.]/g, ""));
      return isNaN(num) ? 0 : parseFloat(num.toFixed(2)); // keep 2 decimals
    };

    const recipe = new Recipe({
      title: parsedRecipe.title,
      description: parsedRecipe.description,
      ingredients: formattedIngredients,
      instructions: parsedRecipe.instructions,
      portionSize,
      category: normalizeCategory(category),
      difficulty,
      nutritionalInfo: {
        calories: parseNutrition(parsedRecipe.nutritionalInfo?.calories),
        protein: parseNutrition(parsedRecipe.nutritionalInfo?.protein),
        fat: parseNutrition(parsedRecipe.nutritionalInfo?.fat),
        carbs: parseNutrition(parsedRecipe.nutritionalInfo?.carbs),
      },
    });

    await recipe.save();

    res.status(201).json({ message: "Recipe created successfully", recipe });
  } catch (error) {
    console.error("Error generating recipe:", error);
    res
      .status(500)
      .json({ error: "Failed to generate recipe", details: error.message });
  }
};

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    const repaired = str.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    return JSON.parse(repaired);
  }
}

function normalizeCategory(cat) {
  if (!cat) return "other";
  // remove non-alphanumeric chars (dash, underscore, etc.)
  const cleaned = cat.toLowerCase().replace(/[^a-z]/g, "");

  if (["veg", "vegetarian"].includes(cleaned)) return "vegetarian";
  if (["nonveg", "nonvegetarian"].includes(cleaned)) return "non-vegetarian"; // matches your schema
  if (["vegan"].includes(cleaned)) return "vegan";
  if (["spicy"].includes(cleaned)) return "spicy";

  return "other";
}

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      ingredients,
      instructions,
      portionSize,
      category,
      difficulty,
      nutritionalInfo,
      image,
    } = req.body;

    // Check if recipe exists
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Update fields if provided
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = ingredients;
    if (instructions) recipe.instructions = instructions;
    if (portionSize) recipe.portionSize = portionSize;
    if (category)
      recipe.category = Array.isArray(category) ? category : [category];
    if (difficulty) recipe.difficulty = difficulty;
    if (nutritionalInfo) recipe.nutritionalInfo = nutritionalInfo;
    if (image) recipe.image = image;

    await recipe.save();

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res
      .status(500)
      .json({ message: "Failed to update recipe", error: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await Recipe.findByIdAndDelete(id);

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete recipe", error: error.message });
  }
};

export const saveRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    const user = await User.findById(userId);
    if (!user.savedRecipes) user.savedRecipes = [];

    // Add recipe to user's savedRecipes
    if (!user.savedRecipes.includes(recipeId)) {
      user.savedRecipes.push(recipeId);
      await user.save();
    }

    // Add user to recipe's savedBy
    if (!recipe.savedBy.includes(userId)) {
      recipe.savedBy.push(userId);
      await recipe.save();
    }

    res.json({
      message: "Recipe saved successfully",
      savedRecipes: user.savedRecipes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to save recipe", error: error.message });
  }
};

export const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const savedRecipes = await Recipe.find({ savedBy: userId });

    console.log(savedRecipes);
    res.status(200).json({
      message: "Here are your saved recipes",
      recipes: savedRecipes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch saved recipes", error: error.message });
  }
};

export const generateRecipeImage = async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GOOGLE_API_KEY not found" });
  }

  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Prompt for Gemini
    const prompt = `Create a professional, restaurant-quality food photo of the dish: ${recipe.title}.
    Style: realistic, appetizing, high resolution, well-lit.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image-preview",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let imageBase64 = null;
    for (const candidate of response.candidates) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          imageBase64 = part.inlineData.data;
        }
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ message: "No image returned by AI" });
    }

    // Save as data URI in DB (simple).
    // Later you can upload to Cloudinary/S3 and just save the URL instead.
    const base64Url = `data:image/png;base64,${imageBase64}`;
    recipe.image = base64Url;
    await recipe.save();

    res.status(200).json({
      message: "Image generated successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error generating recipe image:", error);
    res.status(500).json({
      message: "Failed to generate recipe image",
      error: error.message,
    });
  }
};
