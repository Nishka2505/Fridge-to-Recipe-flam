import React, { useState, useEffect } from "react";
import ServingsScaler from "./ServingsScaler";
import IngredientChecklist from "./IngredientChecklist";
import StepsList from "./StepsList";

export default function RecipeCard({ recipe }) {
  const [currentServings, setCurrentServings] = useState(recipe.servings);

  // Sync state if a new recipe is generated
  useEffect(() => {
    setCurrentServings(recipe.servings);
  }, [recipe]);

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  // Resolve recipe image dynamically based on keywords or presets
  const getRecipeImage = (title) => {
    const t = title.toLowerCase();
    
    // Dessert and Sweet Mappings
    if (t.includes("chocolate") || t.includes("cocoa") || t.includes("brownie") || t.includes("fudge")) {
      return "/images/chocolate-dessert.jpg";
    }
    if (t.includes("pancake") || t.includes("crepe") || t.includes("sweet") || t.includes("treat") || t.includes("dessert") || t.includes("fruit") || t.includes("berry") || t.includes("banana") || t.includes("waffle") || t.includes("honey")) {
      return "/images/pancake-dessert.jpg";
    }
    
    if (t.includes("chicken")) return "/images/garlic-chicken.jpg";
    if (t.includes("tofu")) return "/images/tofu-stirfry.jpg";
    if (t.includes("pasta") || t.includes("primavera")) return "/images/pasta-primavera.jpg";
    if (t.includes("omelet") || t.includes("egg")) return "/images/pepper-omelet.jpg";
    
    // Premium fallback food image from Unsplash
    return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80";
  };

  const imageUrl = getRecipeImage(recipe.title);

  return (
    <div className="w-full glass-panel rounded-2xl shadow-xl shadow-slate-950/50 overflow-hidden animate-slide-up border border-slate-800/40">
      {/* Recipe Banner Image */}
      <div className="relative h-48 sm:h-64 md:h-72 overflow-hidden group">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        
        {/* Title Layer */}
        <div className="absolute bottom-4 left-6 right-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            {recipe.title}
          </h2>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
        {/* Timing Meta Header */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Prep: {recipe.prepTimeMinutes}m
          </span>
          <span className="h-3 w-[1px] bg-slate-700 hidden sm:inline"></span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
            </svg>
            Cook: {recipe.cookTimeMinutes}m
          </span>
          <span className="h-3 w-[1px] bg-slate-700 hidden sm:inline"></span>
          <span className="flex items-center gap-1 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/30 text-indigo-300">
            Total Time: {totalTime}m
          </span>
        </div>

        <hr className="border-slate-800" />

        {/* Serving Scaler Control Card */}
        <ServingsScaler
          servings={currentServings}
          onChange={setCurrentServings}
        />

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <IngredientChecklist
              ingredients={recipe.ingredients}
              recipeTitle={recipe.title}
              originalServings={recipe.servings}
              currentServings={currentServings}
            />
          </div>
          <div className="lg:col-span-3">
            <StepsList steps={recipe.steps} />
          </div>
        </div>

        {/* Dietary/Chef Notes */}
        {recipe.notes && (
          <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.085l-.04.02m-.081-.08l-.04.02a.75.75 0 11-1.085-1.085l.04-.02m0 0a.75.75 0 10-1.085 1.085L10.5 12l.041-.02a.75.75 0 101.084-1.085l-.04-.02zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chef's Notes & Substitution Tips
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {recipe.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
