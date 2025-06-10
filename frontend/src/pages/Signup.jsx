import { useState } from "react";
import { signup } from "../api/auth";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(form);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-green-50 rounded-lg shadow-md border border-green-100">
      <h2 className="text-3xl font-extrabold mb-6 text-green-700 text-center">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

        {/* Email */}
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

        {/* Password */}
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
