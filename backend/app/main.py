import sys
from pathlib import Path
from fastapi import FastAPI
from app.models import Base
from app.database import engine
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router



Base.metadata.create_all(bind=engine)

# Ensure the backend package root is on sys.path when running main.py directly
package_root = Path(__file__).resolve().parent.parent
if str(package_root) not in sys.path:
    sys.path.insert(0, str(package_root))

from app.routes.pdf_routes import router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "Smart PDF AI Running"}