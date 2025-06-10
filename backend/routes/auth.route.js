import express from "express";
import {
  login,
  logout,
  signup,
  onBoard
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/onBoarding",protectRoute, onBoard)
export default router;
