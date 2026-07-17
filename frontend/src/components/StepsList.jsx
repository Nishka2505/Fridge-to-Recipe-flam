import React, { useState } from "react";

export default function StepsList({ steps }) {
  // Keyed state by step id: { "step-1": true, ... }
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (id) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Sort steps by their logical sequence order
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800/60 h-full">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Instructions
      </h3>

      <div className="space-y-4">
        {sortedSteps.map((step) => {
          const isDone = !!completedSteps[step.id];

          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                isDone
                  ? "bg-slate-950/20 border-slate-900/40 opacity-60"
                  : "bg-slate-800/20 hover:bg-slate-800/40 border-slate-700/30 hover:border-slate-700/60"
              }`}
            >
              {/* Checkbox wrapper */}
              <div className="flex items-start h-6 mt-0.5">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => {}} // handled by outer click for better tap target
                  className="w-5 h-5 rounded-full border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer"
                />
              </div>

              {/* Step Detail */}
              <div className="flex-1 space-y-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDone ? "text-slate-500" : "text-indigo-400"}`}>
                  Step {step.order}
                </span>
                <p className={`text-sm leading-relaxed ${isDone ? "text-slate-500 line-through" : "text-slate-200"}`}>
                  {step.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
