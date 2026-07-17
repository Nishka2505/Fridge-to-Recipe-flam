import React from "react";

export default function LoadingState() {
  return (
    <div className="w-full glass-panel rounded-2xl p-6 sm:p-8 animate-pulse space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-slate-800 rounded-lg w-2/3"></div>
        <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
          <div className="h-5 bg-slate-800 rounded w-24"></div>
          <div className="h-5 bg-slate-800 rounded w-20"></div>
          <div className="h-5 bg-slate-800 rounded w-20"></div>
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Servings Scaler Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-850 p-4 rounded-xl border border-slate-800">
        <div className="space-y-2 w-full sm:w-auto">
          <div className="h-4 bg-slate-800 rounded w-28"></div>
          <div className="h-3 bg-slate-800 rounded w-48"></div>
        </div>
        <div className="h-10 bg-slate-800 rounded-lg w-28"></div>
      </div>

      {/* Grid Layout for ingredients and steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Ingredients Checklist Skeleton (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-6 bg-slate-800 rounded w-36 mb-2"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-slate-800 rounded"></div>
              <div className="h-4 bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>

        {/* Steps List Skeleton (3 cols) */}
        <div className="md:col-span-3 space-y-4">
          <div className="h-6 bg-slate-800 rounded w-28 mb-2"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 p-3 bg-slate-900/40 rounded-lg border border-slate-800/40">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-slate-800 rounded-full flex-shrink-0"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
              </div>
              <div className="pl-8">
                <div className="h-3 bg-slate-800 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading micro-animation status */}
      <div className="flex items-center justify-center gap-3 text-sm text-indigo-400 font-medium pt-4">
        <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>AI is crafting your culinary recipe...</span>
      </div>
    </div>
  );
}
