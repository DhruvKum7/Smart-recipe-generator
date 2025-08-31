// SavedCard.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Images } from "lucide-react";

const SavedCard = ({ recipe = {} }) => {
    const {
        _id,
        title = "Untitled recipe",
        image,
        category,
        description = [],
    } = recipe;

    const catStr = Array.isArray(category) ? category[0] : (category || "");
    const isVeg = useMemo(
        () => String(catStr).toLowerCase().includes("veg"),
        [catStr]
    );
    const preview = Array.isArray(description) ? description[0] : description;

    return (
        <article
            className="
        group relative w-full overflow-hidden rounded-3xl
        border border-black/5 bg-white/70 backdrop-blur-xl
        shadow-[0_12px_36px_-14px_rgba(0,0,0,.25)]
        transition hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,.35)]
        dark:bg-gray-900/70 dark:border-white/10
      "
            aria-label={title}
        >
            <Link to={`/recipe/${_id}`} className="block">
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
                            <Images className="w-8 h-8 text-amber-900/70" />
                        </div>
                    )}

                    {/* overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-t-3xl bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

                    {/* category badge */}
                    {catStr && (
                        <span
                            className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium shadow
              ${isVeg ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}
                        >
              {catStr}
            </span>
                    )}
                </div>
            </Link>

            <div className="p-4 sm:p-5">
                <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {title}
                </h3>
                {preview && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                        {preview}
                    </p>
                )}

                {/* CTA */}
                <div className="mt-4">
                    <Link
                        to={`/recipe/${_id}`}
                        className="
              inline-flex items-center justify-center rounded-xl
              bg-gray-900 text-white px-4 py-2 text-sm font-medium
              transition hover:bg-gray-800 active:scale-[0.98]
              dark:bg-white dark:text-gray-900 dark:hover:bg-white/90
            "
                    >
                        View recipe
                    </Link>
                </div>
            </div>

            {/* hover glow */}
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

            {/* reduce motion preference */}
            <style>
                {`
          @media (prefers-reduced-motion: reduce) {
            .transition { transition: none !important; }
          }
        `}
            </style>
        </article>
    );
};

export default SavedCard;
