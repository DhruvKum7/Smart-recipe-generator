import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email, try another one!",
      });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "None", 
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: pwd, ...userWithoutPassword } = newUser._doc;

    return res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.log("Error in the signup controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const { password: pwd, ...userWithoutPassword } = user._doc;

    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  return res
    .status(200)
    .json({ success: true, message: "Logout Successfully" });
};

export const onBoard = async (req, res) => {
  res.status(200).json({ user: req.user });
};
