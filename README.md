# Fridge-to-Recipe AI Planner

An interactive, production-ready React app powered by a FastAPI Python backend and Groq LLM (with simulated fallback mock mode) to transform your leftover fridge ingredients into structured, step-by-step recipes.

---

## 🚀 Setup & Installation

### Prerequisites
- **Python:** Version 3.10 or higher
- **Node.js:** Version 18 or higher (with npm)

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. (Optional) Set up your Groq API Key:
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your `GROQ_API_KEY`. If this key is missing or set to `mock`, the server automatically operates in a robust **Mock Mode** using prefilled, schema-compliant recipes for instant testing.
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend API will run on `http://127.0.0.1:8000`. You can explore the swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
    The application will run on `http://localhost:5173`. Open it in your browser.

### 3. Unified Vercel Deployment (Full Project)
The project is configured for a unified deployment on Vercel. Both the React frontend and FastAPI Python backend run together as a single project on Vercel using serverless execution:

1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New** -> **Project** and import this repository.
3. In the project configure settings:
   - **Build Command**: `npm run build` (This triggers our root build script: `cd frontend && npm install && npm run build`)
   - **Output Directory**: `frontend/dist`
4. Under **Environment Variables**, add:
   - `GROQ_API_KEY`: `<your_actual_groq_api_key>`
5. Click **Deploy**. Vercel will automatically host the static React assets and compile the Python backend under Vercel Serverless Functions!

---

## 🍽️ Key Features & Interaction Walkthrough

- **One-Input structured generation:** Type what you have in your fridge (or click one of the quick starter preset chips) and hit "Generate". The app requests a strictly typed JSON recipe structure from the LLM, parses it, and renders an interactive dashboard.
- **Interactive Checklists:** Both the ingredients list and instructions list feature checkable checkboxes. Ticking items off dims them and adds a strike-through to track your cooking progress.
- **Servings Scaler:** Stepper controls let you increase or decrease servings (from 1 to 20). Ingredient quantities scale in real-time.
- **Deterministic Serving Math:** Quantities are strictly parsed as floats rather than free-form strings, ensuring accurate scaling. Decimal values are dynamically converted into standard cooking fractions (e.g. `1.5` scales and renders as `1½`, `0.25` renders as `¼`).
- **Scoped Ingredient Swaps:** Clicking "Suggest Swap" next to a swappable ingredient runs a secondary, light LLM call requesting exactly 2 substitutes for that specific recipe title, displaying alternatives inline (e.g., "💡 swap: tofu or pork chops") without altering the main recipe.
- **Race Condition & Timeout Guard:** Firing rapid submissions aborts the preceding fetch request using an `AbortController`. Stale, delayed API responses will never overwrite the UI. A 25-second timeout warns users of slow LLM response times.
- **Defensive Schema Validation:** The app runs a validation check against the received JSON schema structure to catch any malformed LLM responses before rendering, falling back to a structured error container.

---

## 🤖 AI-Usage Note

- **Scaffolding and Schemas:** I used Claude/Gemini to draft the Pydantic schema structure and scaffold the standard FastAPI routes and middleware configuration.
- **Frontend Components:** I utilized the AI assistant to generate Tailwind styles and template JSX for the loading skeleton, empty state panels, and error display card layouts.
- **What I wrote myself:**
  - Designed the **stale-response guard logic** and `AbortController` request tracking ref inside `useRecipeRequest.js`.
  - Wrote the **fractional rendering math** inside `scaleQuantity.js` to convert decimals to standard kitchen fraction symbols.
  - Implemented the **mock-mode auto-fallback mechanism** in both backend and frontend, permitting full local testing without requiring credentials.

---

## ⚠️ Known Limitations

1. **Fraction Formatting Capping:** The fraction scaling converts decimals close to `0.25`, `0.33`, `0.5`, `0.67`, and `0.75` into `¼`, `⅓`, `½`, `⅔`, and `¾` respectively. Other decimal fractions (like `0.1` or `0.8`) will display rounded to 1 decimal place (e.g., `1.2`).
2. **Text inputs only:** Ingredient extraction relies on comma-separated or free-form text input and is limited to 500 characters to prevent prompt injections and excessive Groq API rate-limiting usage.
3. **No offline session storage:** Reloading the browser page resets the current recipe and progress checklist states.

---

## ⏱️ Time Spent

Total time: **~3.5 hours**
- **0.5 hours:** Architecture planning, Pydantic schemas, and backend route design.
- **1.0 hour:** Backend FastAPI implementation, mock responses, and groq client integration.
- **1.5 hours:** Frontend React + Vite setup, Tailwind layout, components (scalers, checklist, swaps) wiring.
- **0.5 hours:** Testing race conditions, validation failure boundaries, and writing README documentation.
