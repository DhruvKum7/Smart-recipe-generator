import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // optional validation here
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profile: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    callHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recording",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving (only if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
