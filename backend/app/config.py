import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
