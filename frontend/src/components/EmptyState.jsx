import React from "react";

const EXAMPLE_PRESETS = [
  {
    title: "Garlic Butter Chicken",
    emoji: "🍗",
    text: "chicken breast, spinach, garlic, half an onion, some rice, butter",
    image: "/images/garlic-chicken.jpg",
    ingredients: ["chicken breast", "spinach", "rice", "garlic", "butter"]
  },
  {
    title: "Crispy Ginger Tofu",
    emoji: "🥗",
    text: "firm tofu, broccoli, soy sauce, ginger, sesame oil",
    image: "/images/tofu-stirfry.jpg",
    ingredients: ["tofu", "broccoli", "ginger", "soy sauce", "sesame oil"]
  },
  {
    title: "Pasta Primavera",
    emoji: "🍝",
    text: "pasta, mixed vegetables, olive oil, parmesan cheese, garlic",
    image: "/images/pasta-primavera.jpg",
    ingredients: ["pasta", "mixed veggies", "olive oil", "parmesan", "garlic"]
  },
  {
    title: "Pepper & Onion Omelet",
    emoji: "🍳",
    text: "eggs, bell pepper, onion, cheddar cheese, butter",
    image: "/images/pepper-omelet.jpg",
    ingredients: ["eggs", "bell pepper", "onion", "cheddar", "butter"]
  }
];

export default function EmptyState({ onSelectPreset }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 glass-panel rounded-2xl animate-fade-in py-10">
      <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
        <svg
          className="w-7 h-7 text-indigo-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-slate-100 mb-2">Ready to Cook?</h3>
      <p className="text-slate-400 max-w-md mb-8 text-center text-xs leading-relaxed">
        Input your ingredients in the field above to craft a tailored recipe, or select one of our premium preset options below to see it in action.
      </p>

      <div className="w-full">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-[1px] w-8 bg-slate-700"></div>
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Explore Chef Presets
          </span>
          <div className="h-[1px] w-8 bg-slate-700"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {EXAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPreset(preset.text)}
              type="button"
              className="group text-left relative h-36 rounded-xl overflow-hidden border border-slate-700/50 hover:border-indigo-500/60 transition-all duration-300 shadow-md shadow-slate-950/20 flex flex-col justify-end p-4"
            >
              {/* Background Image */}
              <img
                src={preset.image}
                alt={preset.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:from-slate-950/90 transition-all duration-300"></div>

              {/* Content */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{preset.emoji}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {preset.title}
                  </h4>
                </div>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {preset.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-semibold bg-slate-900/60 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/30"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
