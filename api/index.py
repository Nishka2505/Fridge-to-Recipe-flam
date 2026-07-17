import sys
import os

# Add backend directory to path so main, schema, and llm are importable
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.append(backend_dir)

from main import app
