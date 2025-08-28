import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  rateRecipe
} from "../controllers/recipe.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET all recipes
router.get("/", getAllRecipes);

// GET recipe by ID
router.get("/:id", getRecipeById);

router.post("/", createRecipe);

// PUT update a recipe
router.put("/:id", updateRecipe);

// DELETE remove a recipe
router.delete("/:id", deleteRecipe);

// POST save recipe (to favorites/user)
router.post("/:id/save", saveRecipe);

// POST rate a recipe
router.post("/:id/rate", rateRecipe);

export default router;
