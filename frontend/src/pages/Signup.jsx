import { useState } from "react";
import { signup } from "../api/auth";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [error, setError] = useState("");
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await signup(form);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-700">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-purple-200">
        <h2 className="text-4xl font-extrabold mb-8 text-purple-700 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-purple-700 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
