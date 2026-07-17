from pydantic import BaseModel, Field
from typing import List, Optional

class Ingredient(BaseModel):
    id: str = Field(description="Unique identifier for the ingredient, e.g., 'ing-1', 'ing-2'")
    name: str = Field(description="Name of the ingredient, e.g., 'chicken breast'")
    quantity: float = Field(description="Numerical quantity. MUST be a number (not a string like '2 cups') for scaling.")
    unit: str = Field(description="Unit of measurement, e.g., 'pieces', 'cups', 'g', 'pinch', 'tbsp'")
    swappable: bool = Field(description="True if this ingredient can be easily swapped for something else.")

class Step(BaseModel):
    id: str = Field(description="Unique identifier for the step, e.g., 'step-1'")
    order: int = Field(description="Sequential 1-based order number of the step.")
    text: str = Field(description="Instruction text for the step.")

class Recipe(BaseModel):
    title: str = Field(description="Title of the recipe.")
    servings: int = Field(description="Default number of servings.")
    prepTimeMinutes: int = Field(description="Preparation time in minutes.")
    cookTimeMinutes: int = Field(description="Cooking time in minutes.")
    ingredients: List[Ingredient] = Field(description="List of required ingredients.")
    steps: List[Step] = Field(description="List of preparation/cooking steps in order.")
    notes: Optional[str] = Field(default=None, description="Optional dietary notes, tips, or allergen warnings.")

class RecipeRequest(BaseModel):
    ingredients: str

class SwapRequest(BaseModel):
    ingredientName: str
    recipeTitle: str

class SwapResponse(BaseModel):
    alternatives: List[str]
