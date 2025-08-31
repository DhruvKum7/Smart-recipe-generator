// CreateRecipe.jsx
import React, { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  Utensils,
  Layers,
  ChefHat,
  Gauge,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";

/* ====== Config ====== */
const SUGGESTIONS = [
  "Onion","Tomato","Garlic","Ginger","Potato","Spinach","Carrot","Chicken","Paneer","Milk","Rice","Flour","Butter","Cheese",
];
const MAX_ING = 10;
const MIN_ING = 3;

/* ====== Helpers ====== */
const normalize = (s = "") => s.trim().replace(/\s+/g, " ");
const splitList = (s = "") =>
    s
        .split(/,|\n|;/g)
        .map((x) => normalize(x))
        .filter(Boolean);

export default function CreateRecipe() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [category, setCategory] = useState("vegetarian");
  const [difficulty, setDifficulty] = useState("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const remaining = useMemo(() => Math.max(0, MAX_ING - ingredients.length), [ingredients.length]);

  const addIngredient = useCallback(
      (val) => {
        const items = splitList(val);
        if (!items.length) return;

        let next = [...ingredients];
        for (const raw of items) {
          if (next.length >= MAX_ING) break;
          const v = normalize(raw);
          if (!v) continue;
          if (!next.some((i) => i.toLowerCase() === v.toLowerCase())) {
            next.push(v);
          }
        }
        if (next.length === ingredients.length) {
          setError("Nothing new to add (duplicates or empty).");
          setTimeout(() => setError(""), 2000);
          return;
        }
        setIngredients(next);
        setInput("");
      },
      [ingredients]
  );

  const removeIngredient = (idx) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient(input);
    }
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (/,|\n|;/.test(text)) {
      e.preventDefault();
      addIngredient(text);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (ingredients.length < MIN_ING) {
      setError(`Add at least ${MIN_ING} ingredients.`);
      return;
    }
    if (!normalize(portionSize) || !normalize(category) || !normalize(difficulty)) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
          `${baseUrl}/api/recipe/`,
          {
            ingredients,
            portionSize: normalize(portionSize),
            category,
            difficulty,
          },
          { withCredentials: true }
      );
      navigate("/"); // success
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen grid place-items-center bg-gradient-to-br from-violet-100 via-white to-fuchsia-100">
          <p className="text-sm text-slate-600">Loading…</p>
        </div>
    );
  }

  return (
      <main className="min-h-screen bg-[radial-gradient(90rem_60rem_at_50%_-10%,rgba(139,92,246,0.16),transparent),linear-gradient(to_bottom,#ffffff,#fafafa)] py-8 sm:py-12 px-4 sm:px-6">
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/30 bg-white/70 backdrop-blur-xl shadow-[0_24px_80px_-30px_rgba(139,92,246,0.35)]">
          <header className="px-6 sm:px-10 pt-8 pb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white shadow">
              <Sparkles className="h-3.5 w-3.5" />
              New Recipe
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-violet-600" />
              Create a Recipe
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Add ingredients as chips, choose a category & difficulty, and set a portion size. Fully responsive.
            </p>
          </header>

          <div className="px-6 sm:px-10 pb-8">
            {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* INGREDIENTS */}
              <div>
                <label className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                  <Utensils className="h-5 w-5 text-violet-600" />
                  Ingredients
                  <span className="text-xs font-normal text-slate-500">
                  (min {MIN_ING}, max {MAX_ING})
                </span>
                </label>

                {/* Chips */}
                {ingredients.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {ingredients.map((ing, idx) => (
                          <span
                              key={`${ing}-${idx}`}
                              className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs sm:text-sm font-medium text-violet-800"
                          >
                      {ing}
                            <button
                                type="button"
                                onClick={() => removeIngredient(idx)}
                                className="rounded-full p-0.5 hover:bg-violet-200"
                                aria-label={`Remove ${ing}`}
                                title="Remove"
                            >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                      ))}
                    </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        onPaste={onPaste}
                        list="ingredient-suggestions"
                        placeholder="Type an ingredient, press Enter (or paste a comma-separated list)…"
                        className="w-full rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                    />
                    <datalist id="ingredient-suggestions">
                      {SUGGESTIONS.map((item, i) => (
                          <option key={i} value={item} />
                      ))}
                    </datalist>
                  </div>

                  <button
                      type="button"
                      onClick={() => addIngredient(input)}
                      disabled={!normalize(input) || ingredients.length >= MAX_ING}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <p className="inline-flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    Tip: paste like <em>Onion, Tomato, Ginger</em> and we’ll split them.
                  </p>
                  <p>{remaining} left</p>
                </div>
              </div>

              {/* TWO-COLUMN on md+ */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* PORTION SIZE */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                    <Layers className="h-5 w-5 text-violet-600" />
                    Portion Size
                  </label>
                  <input
                      type="text"
                      value={portionSize}
                      onChange={(e) => setPortionSize(e.target.value)}
                      placeholder="e.g., 4 servings"
                      className="w-full rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                    <ChefHat className="h-5 w-5 text-violet-600" />
                    Category
                  </label>
                  <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten-free">Gluten-Free</option>
                  </select>
                </div>

                {/* DIFFICULTY (full width on md using col-span-2) */}
                <div className="md:col-span-2">
                  <label className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                    <Gauge className="h-5 w-5 text-violet-600" />
                    Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["easy", "medium", "hard"].map((lvl) => {
                      const active = difficulty === lvl;
                      return (
                          <button
                              key={lvl}
                              type="button"
                              onClick={() => setDifficulty(lvl)}
                              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition
                          ${active ? "bg-slate-900 text-white" : "bg-white border border-violet-200 hover:bg-slate-50 text-slate-800"}
                        `}
                              aria-pressed={active}
                          >
                            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                          </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating…
                    </>
                ) : (
                    "Create Recipe"
                )}
              </button>
            </form>
          </div>
        </section>

        {/* reduce motion */}
        <style>{`
        @media (prefers-reduced-motion: reduce) {
          .transition, .animate-spin { transition: none !important; animation: none !important; }
        }
      `}</style>
      </main>
  );
}
