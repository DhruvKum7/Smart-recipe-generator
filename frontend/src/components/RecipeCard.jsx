// RecipeCard.jsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Trash2,
  Clock,
  Utensils,
  Star,
  Images,
} from "lucide-react";

export default function RecipeCard({ recipe = {}, onDelete, user }) {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const {
    _id,
    title = "Untitled recipe",
    image,
    category,
    difficulty,
    cookingTime,
    portionSize,
    userSaved,
    owner,
  } = recipe;

  const [saved, setSaved] = useState(!!userSaved);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const catStr = Array.isArray(category) ? category[0] : (category || "");
  const isVeg = useMemo(
      () => String(catStr).toLowerCase().includes("veg"),
      [catStr]
  );

  const canDelete =
      !!user &&
      (!!owner &&
          ((owner._id && owner._id === user._id) ||
              (owner.email && owner.email === user.email)));

  const showToast = (msg, ms = 2200) => {
    setToast(msg);
    window.clearTimeout((showToast._t || 0));
    showToast._t = window.setTimeout(() => setToast(""), ms);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canDelete || busy) return;
    if (!confirm("Delete this recipe permanently?")) return;

    try {
      setBusy(true);
      await axios.delete(`${baseUrl}/api/recipe/${_id}`, {
        withCredentials: true,
      });
      onDelete?.(_id);
      showToast("Recipe deleted");
      // Optional: navigate away if you're currently on the detail route
      // navigate("/");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy || saved) return;

    try {
      setBusy(true);
      const { data } = await axios.post(
          `${baseUrl}/api/recipe/${_id}/save`,
          {},
          { withCredentials: true }
      );
      setSaved(true);
      showToast(data?.message || "Saved to your recipes");
    } catch (err) {
      showToast(err?.response?.data?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
      <article
          className="
        group relative w-full overflow-hidden rounded-3xl
        border border-black/5 bg-white/70 backdrop-blur-xl
        shadow-[0_12px_36px_-14px_rgba(0,0,0,.25)]
        transition hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,.35)]
      "
          aria-label={title}
      >
        <Link to={`/recipe/${_id}`} className="block relative">
          {/* Media */}
          <div className="relative">
            {image ? (
                <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="h-44 sm:h-52 w-full object-cover"
                />
            ) : (
                <div className="grid h-44 sm:h-52 place-items-center bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200">
                  <Images className="w-8 h-8 text-amber-800/70" />
                </div>
            )}

            {/* overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* category + difficulty chips */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {catStr && (
                  <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shadow
                ${isVeg ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}
                  >
                {catStr}
              </span>
              )}
              {difficulty && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-xs font-medium text-gray-800 shadow">
                <Star className="w-3.5 h-3.5 text-yellow-500" />
                    {difficulty}
              </span>
              )}
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-gray-900">
            {title}
          </h3>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            {typeof cookingTime === "number" && (
                <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
                  {cookingTime} min
            </span>
            )}
            {portionSize && (
                <span className="inline-flex items-center gap-1.5">
              <Utensils className="w-4 h-4" />
                  {portionSize}
            </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            <Link
                to={`/recipe/${_id}`}
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
            >
              View details
            </Link>

            <div className="flex items-center gap-2">
              <button
                  onClick={handleSave}
                  disabled={busy || saved}
                  aria-pressed={saved}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition
                ${saved
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"} disabled:opacity-60`}
              >
                <Heart
                    className={`w-4 h-4 ${saved ? "text-emerald-600 fill-current" : "text-white"}`}
                />
                {saved ? "Saved" : busy ? "Saving..." : "Save"}
              </button>

              {canDelete && (
                  <button
                      onClick={handleDelete}
                      disabled={busy}
                      aria-label="Delete recipe"
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2 text-red-700 hover:bg-red-100 disabled:opacity-60"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
              )}
            </div>
          </div>
        </div>

        {/* Hover glow */}
        <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition group-hover:opacity-100"
            style={{
              background:
                  "radial-gradient(600px circle at var(--mx, 0px) var(--my, 0px), rgba(251,191,36,.18), transparent 40%)",
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
            }}
        />

        {/* Toast */}
        {toast && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-xs font-medium text-white shadow-lg">
              {toast}
            </div>
        )}
      </article>
  );
}
