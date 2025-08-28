import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: [String], // bullet points from AI
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: [String], // AI will split into steps
      required: true,
    },
    portionSize: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/duxeqhtxe/image/upload/v1756270305/1cee65777195641ae9c270cd3970346b_ehwhce.jpg",
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
    },
    tags: [String], // e.g., ["Quick", "Spicy", "Indian"]
    cuisine: { type: String }, // e.g., "Indian", "Italian"
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
