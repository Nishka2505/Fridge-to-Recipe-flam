import { useState, useRef, useCallback } from "react";
import { validateRecipeShape } from "../lib/validateRecipeShape";

export function useRecipeRequest() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ref to track the active AbortController for stale-response guarding
  const activeControllerRef = useRef(null);

  const generateRecipe = useCallback(async (ingredients) => {
    // 1. If there's an ongoing request, abort it immediately
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
    }

    // 2. Create a new AbortController for this request
    const controller = new AbortController();
    activeControllerRef.current = controller;

    setLoading(true);
    setError(null);

    // 3. Set a 25-second timeout to abort if the LLM takes too long
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 25000);

    try {
      // Allow API base URL override from Vite env (default to current host for proxy)
      const apiBase = import.meta.env.VITE_API_URL || "";
      
      const response = await fetch(`${apiBase}/api/recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = `Server error (${response.status})`;
        try {
          const errData = await response.json();
          errorMsg = errData.detail || errorMsg;
        } catch (_) {
          // Fallback to generic status text
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // 4. Client-side Defensive Validation
      validateRecipeShape(data);

      // 5. Success state update (only if this request is still the latest active one)
      if (activeControllerRef.current === controller) {
        setRecipe(data);
        setLoading(false);
      }
    } catch (err) {
      clearTimeout(timeoutId);

      // Handle abort (either from double-submit or timeout)
      if (err.name === "AbortError") {
        // If this controller is still the active one, it means it timed out
        // (If a new request had started, activeControllerRef.current would be different)
        if (activeControllerRef.current === controller) {
          setError("Request timed out (the server took too long to respond). Please try again.");
          setLoading(false);
        }
        // If it was aborted by a newer request, we silent-fail and let the new request update the UI.
      } else {
        // Update error state only if this request wasn't superseded
        if (activeControllerRef.current === controller) {
          setError(err.message || "An unexpected error occurred. Please try again.");
          setLoading(false);
        }
      }
    }
  }, []);

  const reset = useCallback(() => {
    setRecipe(null);
    setError(null);
    setLoading(false);
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
      activeControllerRef.current = null;
    }
  }, []);

  return { recipe, loading, error, generateRecipe, reset };
}
