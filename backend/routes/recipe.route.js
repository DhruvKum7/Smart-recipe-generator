import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  getSavedRecipes,
  generateRecipeImage,
} from "../controllers/recipe.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET all recipes
router.get("/", getAllRecipes);

router.get("/recipe-saved", protectRoute, getSavedRecipes);

// GET recipe by ID
router.get("/:id", getRecipeById);

router.post("/", createRecipe);

// PUT update a recipe
router.put("/:id", updateRecipe);

// DELETE remove a recipe
router.delete("/:id", deleteRecipe);

// POST save recipe (to favorites/user)
router.post("/:id/save", protectRoute, saveRecipe);

router.post("/:id/generate-image", generateRecipeImage);


export default router;
