import { useState } from "react";
import { login } from "../api/auth";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-green-50 rounded-lg shadow-md border border-green-100">
      <h2 className="text-2xl font-extrabold mb-6 text-green-700 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
        >
          <LogIn className="w-5 h-5" />
          Login
        </button>
      </form>
    </div>
  );
}
