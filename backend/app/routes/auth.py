from fastapi import APIRouter
from app.database import SessionLocal
from app.models import User
from passlib.hash import bcrypt

router = APIRouter()