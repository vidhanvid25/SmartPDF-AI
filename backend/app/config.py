from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
#GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
TESSERACT_PATH = os.getenv("TESSERACT_PATH")
POPPLER_PATH = os.getenv("POPPLER_PATH")

#print("Gemini key loaded:", GEMINI_API_KEY[:10] if GEMINI_API_KEY else "NOT FOUND")