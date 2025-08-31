// Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import {
    LogOut,
    UserPlus,
    LogIn,
    Save,
    Menu,
    X,
    Plus,
    Album,
} from "lucide-react";
import { logout } from "../api/auth";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const user = useAuthStore((s) => s.user);
    const clearUser = useAuthStore((s) => s.clearUser);
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const sheetRef = useRef(null);

    // Close mobile menu on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Close on outside click (mobile)
    useEffect(() => {
        function onClick(e) {
            if (open && sheetRef.current && !sheetRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open]);

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            clearUser();
            navigate("/login");
        }
    };

    const initials = (name = "") =>
        name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0]?.toUpperCase())
            .join("") || "U";

    const NavLink = ({ to, icon: Icon, children }) => {
        const active = location.pathname === to;
        return (
            <Link
                to={to}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition
          ${active
                    ? "bg-white text-purple-700 shadow"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
            >
                <Icon className="w-4 h-4" />
                <span>{children}</span>
            </Link>
        );
    };

    return (
        <header className="sticky top-0 z-50">
            <nav
                className="
          relative
          mx-auto
          flex items-center justify-between
          px-4 sm:px-6 lg:px-8 py-3
          bg-[radial-gradient(80rem_40rem_at_50%_-20%,rgba(168,85,247,0.25),transparent),linear-gradient(90deg,#5b21b6,#7c3aed,#4f46e5)]
          text-white
          backdrop-blur
          border-b border-white/10
          shadow-[0_10px_30px_-15px_rgba(0,0,0,.4)]
        "
                aria-label="Primary"
            >
                {/* Brand */}
                <Link
                    to="/"
                    className="relative z-20 text-xl sm:text-2xl font-extrabold tracking-tight select-none"
                >
                    Smart<span className="text-yellow-300">Recipe</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-2">
                    {!user ? (
                        <>
                            <NavLink to="/" icon={UserPlus}>Sign up</NavLink>
                            <NavLink to="/login" icon={LogIn}>Login</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/saved" icon={Save}>Saved</NavLink>
                            <NavLink to="/" icon={Album}>All</NavLink>
                            <NavLink to="/create-recipe" icon={Plus}>Create</NavLink>

                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition bg-white text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>

                            <div
                                title={user.fullName || user.name || user.email}
                                className="ml-2 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 font-bold shadow ring-2 ring-white/20"
                            >
                                {initials(user.fullName || user.name || user.email)}
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden relative z-20 inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label="Toggle menu"
                >
                    {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Mobile sheet */}
                <div
                    id="mobile-menu"
                    className={`md:hidden fixed inset-0 transition ${
                        open ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                    aria-hidden={!open}
                >
                    {/* dim background */}
                    <div
                        className={`absolute inset-0 bg-black/40 transition-opacity ${
                            open ? "opacity-100" : "opacity-0"
                        }`}
                    />
                    {/* sheet panel */}
                    <div
                        ref={sheetRef}
                        className={`
              absolute right-0 top-0 h-full w-11/12 max-w-sm
              bg-white text-gray-900
              shadow-2xl
              transition-transform
              ${open ? "translate-x-0" : "translate-x-full"}
              rounded-l-3xl
              p-6
            `}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <div className="text-lg font-bold">Menu</div>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-lg p-2 hover:bg-gray-100"
                                aria-label="Close menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {!user ? (
                            <div className="grid gap-2">
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    <span>Sign up</span>
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-white font-bold">
                                        {initials(user.fullName || user.name || user.email)}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold">
                                            {user.fullName || user.name || "User"}
                                        </p>
                                        <p className="text-gray-500 text-xs line-clamp-1">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <nav className="grid gap-2">
                                    <Link
                                        to="/saved"
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span>Saved</span>
                                    </Link>
                                    <Link
                                        to="/"
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100"
                                    >
                                        <Album className="w-5 h-5" />
                                        <span>All Recipes</span>
                                    </Link>
                                    <Link
                                        to="/create-recipe"
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>Create</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100 text-red-600"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </nav>
                            </>
                        )}

                        <div className="mt-8 text-xs text-gray-500">
                            <p>© {new Date().getFullYear()} SmartRecipe</p>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Reduce motion for users who prefer it */}
            <style>
                {`
          @media (prefers-reduced-motion: reduce) {
            .transition, .transition-transform, .transition-opacity {
              transition: none !important;
            }
          }
        `}
            </style>
        </header>
    );
}
