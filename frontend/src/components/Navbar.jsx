import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { LogOut, UserPlus, LogIn, Home } from "lucide-react";
import { logout } from "../api/auth";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-purple-700 shadow-lg sticky top-0 z-50 text-white">
      <div className="flex items-center space-x-3 font-extrabold text-xl select-none">
        <Home className="w-6 h-6 text-white" />
        <Link to="/" className="hover:text-purple-300 transition-colors duration-300">
          SmartRecipe
        </Link>
      </div>

      <div className="flex items-center space-x-4 text-sm font-semibold">
        {!user ? (
          <>
            <Link
              to="/signup"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 shadow-sm"
            >
              <UserPlus className="w-5 h-5" />
              <span>Signup</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 shadow-sm"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 shadow-sm focus:outline-none"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
