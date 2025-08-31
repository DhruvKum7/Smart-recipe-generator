// SavedRecipe.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SavedCard from "../components/SavedCard";
import {
  Sparkles,
  Loader2,
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  ArrowUpAZ,
  Clock3,
} from "lucide-react";

export default function SavedRecipe() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // data
  const [recipes, setRecipes] = useState([]);
  // ui state
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("new"); // new | title
  const [activeCat, setActiveCat] = useState("All");

  // fetch
  const fetchSaved = async (signal) => {
    setStatus("loading");
    setError("");
    try {
      const res = await axios.get(`${baseUrl}/api/recipe/recipe-saved`, {
        withCredentials: true,
        signal,
      });
      const list = Array.isArray(res.data?.recipes) ? res.data.recipes : [];
      setRecipes(list);
      setStatus("success");
    } catch (err) {
      if (axios.isCancel(err) || err?.name === "CanceledError") return;
      setError(err?.response?.data?.message || "Failed to load saved recipes.");
      setStatus("error");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchSaved(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  // derive categories for filter chips
  const categories = useMemo(() => {
    const set = new Set();
    recipes.forEach((r) => {
      const c = Array.isArray(r?.category) ? r.category : [r?.category];
      c.filter(Boolean).forEach((x) => set.add(String(x)));
    });
    return ["All", ...Array.from(set)];
  }, [recipes]);

  // filter + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = recipes.filter((r) => {
      const title = String(r?.title || "").toLowerCase();
      const catText = Array.isArray(r?.category)
          ? r.category.join(" ").toLowerCase()
          : String(r?.category || "").toLowerCase();
      const desc0 = Array.isArray(r?.description)
          ? String(r.description[0] || "").toLowerCase()
          : String(r?.description || "").toLowerCase();
      const passQuery = !q || title.includes(q) || catText.includes(q) || desc0.includes(q);
      const passCat = activeCat === "All" || catText.split(" ").includes(activeCat.toLowerCase()) || catText.includes(String(activeCat).toLowerCase());
      return passQuery && passCat;
    });

    if (sort === "title") {
      out = out.sort((a, b) => String(a?.title || "").localeCompare(String(b?.title || "")));
    } else {
      // assume newer items appear later; if dates exist, use them
      out = out.slice().reverse();
    }
    return out;
  }, [recipes, query, activeCat, sort]);

  /* ======================= UI ======================= */

  return (
      <main className="min-h-screen bg-[radial-gradient(80rem_50rem_at_50%_-10%,rgba(124,58,237,0.18),transparent),linear-gradient(to_bottom,#ffffff,#f8fafc)] pb-14">
        {/* Header */}
        <header className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-8 sm:pt-12">
          <div className="rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-[0_24px_80px_-30px_rgba(99,102,241,0.35)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white shadow">
                  <Sparkles className="h-3.5 w-3.5" />
                  Saved Collection
                </div>
                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Your favorite recipes at a glance
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Search, filter by category, and sort the collection. Fully responsive and keyboard-friendly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                    onClick={() => fetchSaved()}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98]"
                    title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-12">
              {/* search */}
              <div className="sm:col-span-6">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search title, category or notes…"
                      className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                      aria-label="Search saved recipes"
                  />
                </div>
              </div>

              {/* category chips (scrollable on mobile) */}
              <div className="sm:col-span-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <span className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700">
                  <Filter className="h-3.5 w-3.5" />
                  Category
                </span>
                  {categories.map((c) => {
                    const active = c === activeCat;
                    return (
                        <button
                            key={c}
                            onClick={() => setActiveCat(c)}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                active
                                    ? "bg-violet-600 text-white shadow"
                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                          {c}
                        </button>
                    );
                  })}
                </div>
              </div>

              {/* sort */}
              <div className="sm:col-span-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                      onClick={() => setSort("new")}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          sort === "new"
                              ? "bg-slate-900 text-white"
                              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                      title="Sort by newest"
                  >
                    <Clock3 className="h-3.5 w-3.5" />
                    Newest
                  </button>
                  <button
                      onClick={() => setSort("title")}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          sort === "title"
                              ? "bg-slate-900 text-white"
                              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                      title="Sort by title"
                  >
                    <ArrowUpAZ className="h-3.5 w-3.5" />
                    Title
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 mt-6 sm:mt-8">
          {/* Error */}
          {status === "error" && (
              <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Can’t load your saved recipes.</p>
                    <p className="opacity-90">{error}</p>
                  </div>
                </div>
              </div>
          )}

          {/* Loading skeletons */}
          {status === "loading" && (
              <div
                  className="
              grid gap-5
              grid-cols-[repeat(auto-fill,minmax(260px,1fr))]
            "
              >
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_12px_36px_-14px_rgba(0,0,0,.12)]"
                    >
                      <div className="h-28 sm:h-32 w-full bg-slate-200/70" />
                      <div className="space-y-3 p-4 sm:p-5">
                        <div className="h-4 w-2/3 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                        <div className="h-9 w-28 rounded-xl bg-slate-200" />
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* Empty / no results */}
          {status === "success" && filtered.length === 0 && (
              <div className="mx-auto grid max-w-xl place-items-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Search className="h-5 w-5" />
                </div>
                <p className="text-slate-700">
                  {recipes.length === 0
                      ? "Your saved list is empty."
                      : "No recipes match your search/filters."}
                </p>
                {recipes.length > 0 && (
                    <button
                        onClick={() => {
                          setQuery("");
                          setActiveCat("All");
                        }}
                        className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Reset filters
                    </button>
                )}
              </div>
          )}

          {/* Grid */}
          {status === "success" && filtered.length > 0 && (
              <div
                  className="
              grid gap-5
              grid-cols-[repeat(auto-fill,minmax(260px,1fr))]
            "
              >
                {filtered.map((r) => (
                    <SavedCard key={r?._id || r?.id} recipe={r} />
                ))}
              </div>
          )}
        </section>

        {/* Footer hint */}
        {status === "loading" && (
            <div className="mx-auto mt-10 flex items-center justify-center gap-2 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              fetching your favorites…
            </div>
        )}

        {/* accessibility & motion */}
        <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          .transition, .animate-pulse { transition: none !important; animation: none !important; }
        }
      `}</style>
      </main>
  );
}
