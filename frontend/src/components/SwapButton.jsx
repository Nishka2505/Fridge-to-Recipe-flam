import React, { useState } from "react";

export default function SwapButton({ ingredientName, recipeTitle }) {
  const [loading, setLoading] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const handleFetchSwap = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredientName: ingredientName,
          recipeTitle: recipeTitle
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load alternatives");
      }

      const data = await response.json();
      setAlternatives(data.alternatives || []);
      setHasFetched(true);
    } catch (err) {
      setError("Failed to load swaps.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-medium px-2 py-0.5 rounded bg-indigo-950/30 border border-indigo-800/30 animate-pulse ml-2">
        <svg className="animate-spin h-3 w-3 text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Finding swaps...
      </span>
    );
  }

  if (hasFetched && alternatives.length > 0) {
    return (
      <span className="inline-flex flex-wrap items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded-lg ml-2 animate-fade-in">
        <span className="text-emerald-400">💡 swap:</span>
        {alternatives.join(" or ")}
      </span>
    );
  }

  return (
    <div className="inline-block ml-2">
      <button
        type="button"
        onClick={handleFetchSwap}
        className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/20 hover:bg-indigo-900/30 border border-indigo-800/30 px-2 py-0.5 rounded transition-all duration-200"
      >
        Suggest Swap
      </button>
      {error && (
        <span className="text-[10px] text-rose-400 font-medium ml-1.5">{error}</span>
      )}
    </div>
  );
}
