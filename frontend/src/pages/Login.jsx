// Login.jsx
import { useState } from "react";
import { login } from "../api/auth";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const emailOk = /^\S+@\S+\.\S+$/.test(form.email);
  const passwordOk = form.password.length >= 6;
  const canSubmit = emailOk && passwordOk && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await login(form); // expects { user }
      setUser(res.data.user);
      if (remember) {
        // basic remember-me: keep a flag (your auth flow can store tokens/cookies already)
        localStorage.setItem("remember_me", "1");
      } else {
        localStorage.removeItem("remember_me");
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen grid place-items-center bg-[radial-gradient(60rem_40rem_at_50%_-10%,rgba(147,51,234,0.25),transparent),linear-gradient(to_bottom_right,#4c1d95,#6d28d9,#7c3aed)] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(124,58,237,.45)] p-6 sm:p-8">
          <h1 className="text-center text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-fuchsia-600 mb-6">
            Welcome back
          </h1>

          {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">Email</label>
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Email"
                  className={`w-full pl-10 pr-3 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 transition 
                ${emailOk ? "border-purple-200 focus:ring-purple-400" : "border-red-200 focus:ring-red-300"}`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!emailOk}
                  aria-describedby="email-help"
              />
              <p id="email-help" className="mt-1 text-xs text-gray-500">Use a valid email like name@domain.com</p>
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password (min 6 chars)"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white/80 focus:outline-none focus:ring-2 transition 
                ${passwordOk ? "border-purple-200 focus:ring-purple-400" : "border-red-200 focus:ring-red-300"}`}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  aria-invalid={!passwordOk}
              />
              <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Extras */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Remember me
              </label>
              <button
                  type="button"
                  className="text-sm text-purple-700 hover:underline"
                  onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={!canSubmit}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white py-3 font-semibold shadow-lg hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs sm:text-sm text-gray-600 text-center mt-6">
            Don’t have an account?{" "}
            <button
                className="text-purple-700 font-medium hover:underline"
                onClick={() => navigate("/")}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
  );
}
