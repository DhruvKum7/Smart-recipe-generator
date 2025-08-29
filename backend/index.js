import express from "express";
import dotenv from "dotenv";
import authRoute from './routes/auth.route.js';
import { connectDB } from "./lib/db.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import recipeRoute from "./routes/recipe.route.js"
import { protectRoute } from "./middlewares/auth.middleware.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://smartrecipegenerator-1.onrender.com"
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/recipe", recipeRoute);  

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
  connectDB();
});
