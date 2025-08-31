import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { LogOut, UserPlus, LogIn, Home, Plus, Album, Save, Menu, X } from "lucide-react";
import { logout } from "../api/auth";
import { useState } from "react";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/login");
    setMenuOpen(false);
  };

  const getInitials = (name = "") => {
    return name
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .slice(0, 2)
        .join("");
  };

  return (
      <nav className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 shadow-xl sticky top-0 z-50 text-white">
        {/* Brand */}
        <div className="flex items-center space-x-3 font-extrabold text-2xl select-none">
          <Link to="/" className="hover:text-indigo-200 transition-colors duration-300">
            SmartRecipe
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-4 text-sm font-semibold">
          {!user ? (
              <>
                <Link
                    to="/"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 shadow-md"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Signup</span>
                </Link>
                <Link
                    to="/login"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-all duration-200 shadow-md"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              </>
          ) : (
              <div className="flex items-center space-x-3 justify-evenly">
                <Link
                    to="/saved"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-orange-700 hover:bg-orange-100 hover:text-orange-900 transition-all duration-200 shadow-md"
                >
                  <Save className="w-5 h-5" />
                  <span>Saved </span>
                </Link>

                <Link
                    to="/"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-green-700 hover:bg-green-100 hover:text-green-900 transition-all duration-200 shadow-md"
                >
                  <Album className="w-5 h-5" />
                  <span>ALL</span>
                </Link>
                <Link
                    to="/create-recipe"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-yellow-700 hover:bg-yellow-100 hover:text-yellow-900 transition-all duration-200 shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white text-red-600 hover:bg-red-200 hover:text-red-700 transition-all duration-200 shadow-md focus:outline-none cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                <div
                    title={user.fullName || user.name || user.email}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  {getInitials(user.fullName || user.name || user.email)}
                </div>
              </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
            <div className="absolute top-16 left-0 w-full bg-white text-black shadow-lg flex flex-col p-4 space-y-3 sm:hidden">
              {!user ? (
                  <>
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Signup</span>
                    </Link>
                    <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                  </>
              ) : (
                  <>
                    <Link
                        to="/saved"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                      <Save className="w-5 h-5" />
                      <span>Saved</span>
                    </Link>
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                      <Album className="w-5 h-5" />
                      <span>ALL</span>
                    </Link>
                    <Link
                        to="/create-recipe"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
              )}
            </div>
        )}
      </nav>
  );
}
