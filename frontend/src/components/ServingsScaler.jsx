import React from "react";

export default function ServingsScaler({ servings, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-slate-800/60 hover:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/40 transition-colors">
      <div className="text-left">
        <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">Servings Scale</span>
        <span className="text-[11px] text-slate-500 block">Quantities auto-scale in real-time</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, servings - 1))}
          className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 hover:text-white text-slate-300 font-bold flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-slate-600/40"
          disabled={servings <= 1}
          aria-label="Decrease servings"
        >
          &minus;
        </button>
        
        <div className="text-center min-w-[3.5rem] flex flex-col justify-center">
          <span className="text-lg font-bold text-indigo-400 leading-none">{servings}</span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            {servings === 1 ? "serving" : "servings"}
          </span>
        </div>
        
        <button
          type="button"
          onClick={() => onChange(Math.min(20, servings + 1))}
          className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 hover:text-white text-slate-300 font-bold flex items-center justify-center transition-colors disabled:opacity-30 border border-slate-600/40"
          disabled={servings >= 20}
          aria-label="Increase servings"
        >
          +
        </button>
      </div>
    </div>
  );
}
