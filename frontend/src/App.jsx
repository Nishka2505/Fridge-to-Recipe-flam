import React, { useState } from "react";
import { useRecipeRequest } from "./hooks/useRecipeRequest";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import RecipeCard from "./components/RecipeCard";

export default function App() {
  const [ingredientsInput, setIngredientsInput] = useState("");
  const { recipe, loading, error, generateRecipe, reset } = useRecipeRequest();
  const [clientError, setClientError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanInput = ingredientsInput.trim();
    
    // Client-side quick checks
    if (!cleanInput) {
      setClientError("Please type at least one ingredient first.");
      return;
    }
    if (cleanInput.length > 500) {
      setClientError("Input is too long (maximum 500 characters). Please condense your list.");
      return;
    }

    setClientError(null);
    generateRecipe(cleanInput);
  };

  const handleSelectPreset = (presetText) => {
    setIngredientsInput(presetText);
    setClientError(null);
    generateRecipe(presetText);
  };

  const handleClear = () => {
    setIngredientsInput("");
    setClientError(null);
    reset();
  };

  const handleTextareaChange = (e) => {
    setIngredientsInput(e.target.value);
    if (clientError) {
      setClientError(null);
    }
  };

  const activeError = error || clientError;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col justify-between">
      {/* Header section */}
      <header className="text-center mb-8 space-y-2 select-none animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          🍳 Fridge-to-Recipe AI
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Turn your leftover ingredients into a structured, step-by-step interactive cooking recipe instantly.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow space-y-6">
        {/* User Input Card */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-950/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="fridge-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-400 block"
              >
                What's in your fridge?
              </label>
              
              <div className="relative">
                <textarea
                  id="fridge-input"
                  rows="3"
                  className="w-full bg-slate-950/40 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                  placeholder="e.g. chicken breast, spinach, garlic, half an onion, some rice..."
                  value={ingredientsInput}
                  onChange={handleTextareaChange}
                  disabled={loading}
                />
                
                {/* Character Count Counter */}
                <span className={`absolute bottom-3 right-3 text-[10px] font-bold ${
                  ingredientsInput.length > 500 ? "text-rose-400" : "text-slate-500"
                }`}>
                  {ingredientsInput.length}/500
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleClear}
                disabled={loading || (!ingredientsInput && !recipe)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-750 bg-slate-800/20 hover:bg-slate-800/60 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={loading || !ingredientsInput.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 transition-all duration-150 flex items-center gap-2 select-none disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <span>Generate Recipe</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic State Views */}
        <div className="space-y-4">
          {loading && <LoadingState />}
          
          {!loading && activeError && (
            <ErrorState
              error={activeError}
              onRetry={() => generateRecipe(ingredientsInput.trim())}
            />
          )}

          {!loading && !activeError && recipe && (
            <RecipeCard recipe={recipe} />
          )}

          {!loading && !activeError && !recipe && (
            <EmptyState onSelectPreset={handleSelectPreset} />
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="text-center py-8 text-xs text-slate-500 font-medium select-none">
        Fridge-to-Recipe Planner &bull; Created for Take-Home Assignment
      </footer>
    </div>
  );
}
