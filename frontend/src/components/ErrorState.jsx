import React from "react";

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="w-full bg-rose-950/20 border border-rose-500/20 rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
      <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
        <svg
          className="w-7 h-7 text-rose-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-rose-200 mb-2">Failed to Generate Recipe</h3>
      
      <div className="max-w-md mx-auto bg-rose-950/40 px-4 py-3 rounded-lg border border-rose-500/10 mb-6">
        <p className="text-xs font-mono text-rose-300 leading-relaxed break-words">
          {error}
        </p>
      </div>

      <button
        onClick={onRetry}
        type="button"
        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-rose-900/20 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
      >
        Try Again
      </button>
    </div>
  );
}
