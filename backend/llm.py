import os
import json
import logging
from openai import OpenAI
from dotenv import load_dotenv
from schema import Recipe, Ingredient, Step

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# Setup OpenAI client pointing to Groq's endpoint if API key is present
client = None
if GROQ_API_KEY and GROQ_API_KEY.strip() not in ("", "YOUR_GROQ_API_KEY_HERE", "mock"):
    logger.info("Initializing Groq API client with provided API Key.")
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=GROQ_API_KEY
    )
else:
    logger.warning("GROQ_API_KEY not set. Backend will run in MOCK MODE.")

def get_mock_recipe(user_input: str) -> dict:
    """Returns a mock recipe matching the schema based on input keywords, dynamically compiling inputs if needed."""
    user_input_lower = user_input.lower()
    
    if "chicken" in user_input_lower or "spinach" in user_input_lower or "rice" in user_input_lower:
        return {
            "title": "Garlic Butter Chicken Breast with Spinach",
            "servings": 2,
            "prepTimeMinutes": 10,
            "cookTimeMinutes": 15,
            "ingredients": [
                { "id": "ing-1", "name": "chicken breast", "quantity": 2.0, "unit": "pieces", "swappable": True },
                { "id": "ing-2", "name": "spinach", "quantity": 2.0, "unit": "cups", "swappable": True },
                { "id": "ing-3", "name": "garlic", "quantity": 4.0, "unit": "cloves", "swappable": False },
                { "id": "ing-4", "name": "half an onion", "quantity": 0.5, "unit": "piece", "swappable": True },
                { "id": "ing-5", "name": "rice", "quantity": 1.0, "unit": "cup", "swappable": True },
                { "id": "ing-6", "name": "butter", "quantity": 2.0, "unit": "tbsp", "swappable": True }
            ],
            "steps": [
                { "id": "step-1", "order": 1, "text": "Cook the rice according to package instructions." },
                { "id": "step-2", "order": 2, "text": "Season chicken breasts with salt, pepper, and minced garlic." },
                { "id": "step-3", "order": 3, "text": "Melt butter in a skillet over medium-high heat. Sear chicken for 6-7 minutes per side until cooked through." },
                { "id": "step-4", "order": 4, "text": "Remove chicken. In the same skillet, sauté sliced onions and garlic until translucent." },
                { "id": "step-5", "order": 5, "text": "Stir in the spinach and cook until wilted. Serve alongside the chicken and rice." }
            ],
            "notes": "Contains dairy. For a dairy-free version, swap butter for olive oil."
        }
    elif "tofu" in user_input_lower or "vegan" in user_input_lower or "vegetarian" in user_input_lower or "broccoli" in user_input_lower:
        return {
            "title": "Crispy Tofu and Veggie Stir-Fry",
            "servings": 2,
            "prepTimeMinutes": 15,
            "cookTimeMinutes": 10,
            "ingredients": [
                { "id": "ing-1", "name": "firm tofu", "quantity": 1.0, "unit": "block", "swappable": True },
                { "id": "ing-2", "name": "soy sauce", "quantity": 2.0, "unit": "tbsp", "swappable": False },
                { "id": "ing-3", "name": "ginger", "quantity": 1.0, "unit": "tsp", "swappable": True },
                { "id": "ing-4", "name": "broccoli florets", "quantity": 1.5, "unit": "cups", "swappable": True },
                { "id": "ing-5", "name": "sesame oil", "quantity": 1.0, "unit": "tbsp", "swappable": True }
            ],
            "steps": [
                { "id": "step-1", "order": 1, "text": "Press the tofu to remove excess moisture, then cut into cubes." },
                { "id": "step-2", "order": 2, "text": "Heat sesame oil in a large pan or wok over high heat. Fry tofu cubes until golden and crispy on all sides." },
                { "id": "step-3", "order": 3, "text": "Add broccoli florets and minced ginger. Stir-fry for 3-4 minutes." },
                { "id": "step-4", "order": 4, "text": "Pour soy sauce over the mixture and toss to coat. Cook for 1 more minute and serve hot." }
            ],
            "notes": "Gluten-free if using tamari instead of soy sauce."
        }
    elif "pasta" in user_input_lower or "spaghetti" in user_input_lower or "macaroni" in user_input_lower:
        return {
            "title": "Fridge Clean-Out Pasta Primavera",
            "servings": 4,
            "prepTimeMinutes": 15,
            "cookTimeMinutes": 15,
            "ingredients": [
                { "id": "ing-1", "name": "pasta", "quantity": 12.0, "unit": "oz", "swappable": True },
                { "id": "ing-2", "name": "mixed vegetables", "quantity": 3.0, "unit": "cups", "swappable": True },
                { "id": "ing-3", "name": "olive oil", "quantity": 3.0, "unit": "tbsp", "swappable": True },
                { "id": "ing-4", "name": "parmesan cheese", "quantity": 0.5, "unit": "cup", "swappable": True },
                { "id": "ing-5", "name": "garlic", "quantity": 3.0, "unit": "cloves", "swappable": False }
            ],
            "steps": [
                { "id": "step-1", "order": 1, "text": "Boil pasta in salted water according to package instructions, reserving 1/2 cup of pasta water." },
                { "id": "step-2", "order": 2, "text": "Heat olive oil in a skillet, sauté minced garlic and mixed vegetables until tender-crisp." },
                { "id": "step-3", "order": 3, "text": "Toss pasta, vegetables, and parmesan cheese together, adding pasta water as needed to create a light sauce." }
            ],
            "notes": "Vegetarian. Swap parmesan for nutritional yeast to make it vegan."
        }
    else:
        # Dynamic fallback mock recipe based on the user's specific typed ingredients
        # Split by comma first, then by space if needed
        parts = [p.strip() for p in user_input.replace(",", " ").split() if len(p.strip()) > 2]
        
        # Filter out common filler words
        stop_words = {"and", "with", "some", "the", "for", "any", "that", "this", "some", "more", "fresh"}
        ingredients_found = [p for p in parts if p.lower() not in stop_words]
        
        # If no words remain, fallback to generic list
        if not ingredients_found:
            ingredients_found = ["pantry staples", "vegetables"]
            
        title_ingredient = ingredients_found[0].title()
        
        # Check if sweet/dessert keywords exist
        sweet_keywords = {"chocolate", "pancake", "strawberry", "banana", "apple", "berry", "sugar", "honey", "cream", "dessert", "cookie", "cake", "fruit", "cocoa", "maple", "syrup", "vanilla", "cinnamon"}
        is_sweet = any(kw in user_input_lower for kw in sweet_keywords)
        
        if is_sweet:
            title = f"Fridge Clean-Out {title_ingredient} Sweet Treat"
            
            ingredients_list = []
            for idx, name in enumerate(ingredients_found[:5]):
                ingredients_list.append({
                    "id": f"ing-{idx+1}",
                    "name": name,
                    "quantity": float(idx + 1),
                    "unit": "pieces" if idx % 2 == 0 else "tbsp",
                    "swappable": True
                })
                
            ingredients_list.append({
                "id": f"ing-{len(ingredients_list)+1}",
                "name": "butter",
                "quantity": 1.0,
                "unit": "tbsp",
                "swappable": True
            })
            ingredients_list.append({
                "id": f"ing-{len(ingredients_list)+1}",
                "name": "honey",
                "quantity": 2.0,
                "unit": "tbsp",
                "swappable": True
            })
            
            steps = [
                {
                    "id": "step-1",
                    "order": 1,
                    "text": f"Gather and prepare your sweet ingredients: slice fruits and measure {', '.join(ingredients_found[:3])}."
                },
                {
                    "id": "step-2",
                    "order": 2,
                    "text": "Melt the butter in a pan over low heat until warm and fully liquid."
                },
                {
                    "id": "step-3",
                    "order": 3,
                    "text": f"Add the {', '.join(ingredients_found[:3])} to the pan. Cook gently on low-medium heat for 5 minutes until soft and caramelized."
                },
                {
                    "id": "step-4",
                    "order": 4,
                    "text": "Drizzle honey on top. Serve warm and enjoy your sweet treat!"
                }
            ]
        else:
            title = f"Fridge Clean-Out {title_ingredient} Skillet"
            
            ingredients_list = []
            for idx, name in enumerate(ingredients_found[:5]): # limit to 5
                ingredients_list.append({
                    "id": f"ing-{idx+1}",
                    "name": name,
                    "quantity": float(idx + 1),
                    "unit": "pieces" if idx % 2 == 0 else "cups",
                    "swappable": True
                })
                
            # Add basic savory pantry items
            ingredients_list.append({
                "id": f"ing-{len(ingredients_list)+1}",
                "name": "olive oil",
                "quantity": 1.0,
                "unit": "tbsp",
                "swappable": True
            })
            ingredients_list.append({
                "id": f"ing-{len(ingredients_list)+1}",
                "name": "garlic",
                "quantity": 2.0,
                "unit": "cloves",
                "swappable": False
            })
            
            steps = [
                {
                    "id": "step-1",
                    "order": 1,
                    "text": f"Gather and prepare your ingredients: chop the {', '.join(ingredients_found[:3])}."
                },
                {
                    "id": "step-2",
                    "order": 2,
                    "text": "Heat the olive oil in a pan over medium heat. Sauté minced garlic until it is golden and fragrant."
                },
                {
                    "id": "step-3",
                    "order": 3,
                    "text": f"Gently fold in the {', '.join(ingredients_found[:3])}. Sauté for 6-8 minutes until thoroughly cooked."
                },
                {
                    "id": "step-4",
                    "order": 4,
                    "text": "Season to taste with salt and herbs. Serve hot!"
                }
            ]
        
        return {
            "title": title,
            "servings": 2,
            "prepTimeMinutes": 10,
            "cookTimeMinutes": 12,
            "ingredients": ingredients_list,
            "steps": steps,
            "notes": "Dynamic mock recipe. Add a GROQ_API_KEY in backend/.env to trigger real AI generations."
        }

def clean_json_response(raw_text: str) -> str:
    """Strips markdown fences and leading/trailing whitespace from LLM output."""
    cleaned = raw_text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()

def generate_recipe_llm(ingredients: str) -> dict:
    """Generates a recipe using Groq or falls back to mock mode if credentials missing."""
    if not client:
        logger.info("Using mock recipe since API client is not configured.")
        return get_mock_recipe(ingredients)

    system_instruction = (
        "You are a professional chef. You will receive a list of ingredients in a fridge. "
        "Design a single delicious recipe using these ingredients and common pantry items.\n"
        "You MUST return ONLY valid JSON matching this schema exactly:\n"
        "{\n"
        "  \"title\": \"string\",\n"
        "  \"servings\": 4,\n"
        "  \"prepTimeMinutes\": 15,\n"
        "  \"cookTimeMinutes\": 20,\n"
        "  \"ingredients\": [\n"
        "    { \"id\": \"ing-1\", \"name\": \"chicken breast\", \"quantity\": 2.0, \"unit\": \"pieces\", \"swappable\": true }\n"
        "  ],\n"
        "  \"steps\": [\n"
        "    { \"id\": \"step-1\", \"order\": 1, \"text\": \"Season the chicken with salt and pepper.\" }\n"
        "  ],\n"
        "  \"notes\": \"string (optional)\"\n"
        "}\n\n"
        "RULES:\n"
        "1. Do NOT wrap your output in markdown code blocks. Do NOT output ```json ... ```. Just return raw JSON text.\n"
        "2. The quantity field MUST be a number, not a string (e.g. 2.0, not '2 pieces' or 'a cup'). Store the unit in the 'unit' field.\n"
        "3. Every ingredient and step must have a unique 'id' string (e.g. 'ing-1', 'ing-2', 'step-1').\n"
        "4. Do not include commentary, conversational filler, or formatting besides JSON."
    )

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"Ingredients list: {ingredients}"}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        raw_content = response.choices[0].message.content
        cleaned_content = clean_json_response(raw_content)
        parsed_json = json.loads(cleaned_content)
        return parsed_json
    except Exception as e:
        logger.error(f"Error during Groq LLM API call: {e}")
        # Fall back to mock response to maintain resilience
        logger.warning("Groq API call failed. Falling back to mock recipe.")
        return get_mock_recipe(ingredients)

def suggest_swap_llm(ingredient_name: str, recipe_title: str) -> list[str]:
    """Generates a swap suggestion list for a swappable ingredient."""
    if not client:
        # Mock swap suggestions
        ing_lower = ingredient_name.lower()
        if "chicken" in ing_lower:
            return ["tofu", "pork chops"]
        elif "spinach" in ing_lower:
            return ["kale", "arugula"]
        elif "butter" in ing_lower:
            return ["olive oil", "coconut oil"]
        elif "rice" in ing_lower:
            return ["quinoa", "cauliflower rice"]
        elif "pasta" in ing_lower:
            return ["zucchini noodles", "spaghetti squash"]
        else:
            return [f"another type of {ingredient_name}", "a suitable vegetable alternative"]

    system_instruction = (
        "You are a professional chef. You will receive an ingredient name and the recipe title it belongs to.\n"
        "Provide exactly two alternative ingredients that can substitute for this ingredient in the recipe.\n"
        "Your response must be a JSON object matching this schema exactly:\n"
        "{\n"
        "  \"alternatives\": [\"alternative 1\", \"alternative 2\"]\n"
        "}\n"
        "Do NOT write any conversation or markdown code blocks."
    )

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"Substitute '{ingredient_name}' in the recipe '{recipe_title}'."}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        raw_content = response.choices[0].message.content
        cleaned_content = clean_json_response(raw_content)
        parsed_json = json.loads(cleaned_content)
        return parsed_json.get("alternatives", [f"another type of {ingredient_name}", "veggie option"])
    except Exception as e:
        logger.error(f"Error during Groq Swap LLM API call: {e}")
        return [f"another type of {ingredient_name}", "a suitable alternative"]
