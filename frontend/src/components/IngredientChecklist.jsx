import React, { useState } from "react";
import { scaleQuantity } from "../lib/scaleQuantity";
import SwapButton from "./SwapButton";

// Lookup table matching common ingredients to premium Unsplash thumbnails
const getIngredientImage = (name) => {
  const n = name.toLowerCase();
  if (n.includes("chicken")) return "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=80&q=80";
  if (n.includes("salmon")) return "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=80&q=80";
  if (n.includes("spinach")) return "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=80&q=80";
  if (n.includes("tofu")) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80";
  if (n.includes("broccoli")) return "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=80&q=80";
  if (n.includes("ginger")) return "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=80&q=80";
  if (n.includes("pasta") || n.includes("noodle") || n.includes("spaghetti")) return "https://images.unsplash.com/photo-1621961475769-e137ab77b678?auto=format&fit=crop&w=80&q=80";
  if (n.includes("cheese") || n.includes("cheddar") || n.includes("parmesan")) return "https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=80&q=80";
  if (n.includes("garlic")) return "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=80&q=80";
  if (n.includes("onion")) return "https://images.unsplash.com/photo-1508747703725-7197771375a0?auto=format&fit=crop&w=80&q=80";
  if (n.includes("egg")) return "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=80&q=80";
  if (n.includes("chocolate") || n.includes("cocoa")) return "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=80&q=80";
  if (n.includes("banana")) return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=80&q=80";
  if (n.includes("strawberry") || n.includes("berry") || n.includes("blueberries")) return "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=80&q=80";
  if (n.includes("milk") || n.includes("cream")) return "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=80&q=80";
  if (n.includes("butter")) return "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=80&q=80";
  if (n.includes("honey") || n.includes("syrup")) return "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=80&q=80";
  if (n.includes("lemon") || n.includes("lime")) return "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=80&q=80";
  if (n.includes("asparagus")) return "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=80&q=80";
  if (n.includes("rice") || n.includes("quinoa")) return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=80&q=80";
  if (n.includes("bread") || n.includes("toast") || n.includes("wrap") || n.includes("tortilla") || n.includes("slice")) return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=80&q=80";
  return null;
};

export default function IngredientChecklist({ ingredients, recipeTitle, originalServings, currentServings }) {
  // Keyed state by ingredient id: { "ing-1": true, "ing-2": false, ... }
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleCheck = (id) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800/60 h-full">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        Ingredients
      </h3>
      
      <ul className="space-y-3.5">
        {ingredients.map((ing) => {
          const isChecked = !!checkedIngredients[ing.id];
          const displayQty = scaleQuantity(ing.quantity, originalServings, currentServings);
          const ingImg = getIngredientImage(ing.name);
          
          return (
            <li
              key={ing.id}
              className="flex items-center gap-3 select-none text-slate-300"
            >
              <div className="flex items-center h-6">
                <input
                  id={ing.id}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCheck(ing.id)}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50 focus:ring-2 cursor-pointer transition-colors"
                />
              </div>
              
              {/* Ingredient image thumbnail */}
              {ingImg && (
                <img
                  src={ingImg}
                  alt={ing.name}
                  className={`w-6 h-6 rounded-full object-cover border border-slate-700/60 transition-opacity duration-200 flex-shrink-0 ${
                    isChecked ? "opacity-30" : "opacity-100"
                  }`}
                />
              )}
              
              <div className="flex-1 flex flex-wrap items-center leading-tight">
                <label
                  htmlFor={ing.id}
                  className={`cursor-pointer transition-all duration-150 ${
                    isChecked ? "text-slate-500 line-through" : "text-slate-200"
                  }`}
                >
                  <span className="font-semibold text-slate-100 mr-1.5">
                    {displayQty} {ing.unit}
                  </span>
                  <span>{ing.name}</span>
                </label>

                {ing.swappable && !isChecked && (
                  <SwapButton
                    ingredientName={ing.name}
                    recipeTitle={recipeTitle}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
