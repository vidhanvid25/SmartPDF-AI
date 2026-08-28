from fastapi import (APIRouter, UploadFile, File, Form)
from typing import List
import shutil
import os
import hashlib
from fastapi.responses import StreamingResponse
import io
import re

from app.services.pdf_processor import extract_pdf_text

from app.services.ai_extractor import extract_structured_data

from app.services.postgres_service import save_to_db

#from fastapi.responses import FileResponse
from app.database import SessionLocal
from app.models import PDFData, TempPDFData
from app.models import User
from random import randint
from datetime import (
    datetime,
    timedelta
)

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload-pdfs")
async def upload_pdfs(
    files: List[UploadFile] = File(...),
    entry_by: str = Form(...)
):

    uploaded = []
    duplicates = []

    db = SessionLocal()

    try:

        for file in files:

            pdf_bytes = await file.read()

            pdf_hash = hashlib.sha256(
                pdf_bytes
            ).hexdigest()

            existing_temp = (
                db.query(TempPDFData)
                .filter(
                    TempPDFData.pdf_hash == pdf_hash,
                    TempPDFData.entry_by == entry_by
                )
                .first()
            )

            existing_master = (
                db.query(PDFData)
                .filter(
                    PDFData.pdf_hash == pdf_hash,
                    PDFData.entry_by == entry_by
                )
                .first()
            )

            if existing_temp or existing_master:
                duplicates.append(
                    file.filename
                )
                continue

            file_path = os.path.join(
                UPLOAD_FOLDER,
                file.filename
            )

            with open(file_path, "wb") as buffer:
                buffer.write(pdf_bytes)

            extracted_text, page_count = (
                extract_pdf_text(file_path)
            )

            structured_data = (
                extract_structured_data(
                    extracted_text,
                    file_path
                )
            )

            save_to_db(
                file.filename,
                structured_data,
                page_count,
                pdf_bytes,
                entry_by,
                pdf_hash
            )

            uploaded.append(file.filename)

        return {

            "message":
            f"{len(uploaded)} PDFs uploaded successfully",

            "uploaded":
            uploaded,

            "duplicates":
            duplicates
        }

    finally:
        db.close()

from fastapi.responses import StreamingResponse
from io import BytesIO

@router.get("/pdf/{pdf_id}")
def open_pdf(pdf_id: int):

    db = SessionLocal()

    try:
        pdf = db.query(PDFData).filter(
            PDFData.id == pdf_id
        ).first()

        if not pdf:
            return {"error": "PDF not found"}

        return StreamingResponse(
            BytesIO(pdf.pdf_file),
            media_type="application/pdf"
        )

    finally:
        db.close()

@router.get("/pdfs")
def get_all_pdfs():

    db = SessionLocal()

    try:

        pdfs = db.query(PDFData).all()

        result = []

        for pdf in pdfs:

            user = (
                db.query(User)
                .filter(
                    User.username ==
                    pdf.entry_by
                )
                .first()
            )

            result.append(
                {
                    "id": pdf.id,
                    "pdf_name": pdf.pdf_name,
                    "full_name":
                        user.full_name
                        if user else "",
                    "entry_by": pdf.entry_by,
                    "pdf_type": pdf.pdf_type,
                    "page_count": pdf.page_count,
                    "summary": pdf.pdf_summary,
                    "uploaded_at":
                        str(pdf.uploaded_at),
                    "last_modified":
                        str(pdf.last_modified)
                }
            )

        return result

    finally:
        db.close()

@router.get("/pdfs/type/{pdf_type}")
def get_pdf_by_type(pdf_type: str):

    db = SessionLocal()

    try:

        pdfs = db.query(
            PDFData
        ).filter(
            PDFData.pdf_type == pdf_type
        ).all()

        result = []

        for pdf in pdfs:

            result.append(
                {
                    "id": pdf.id,
                    "pdf_name": pdf.pdf_name,
                    "entry_by": pdf.entry_by,
                    "pdf_type": pdf.pdf_type,
                    "page_count": pdf.page_count,
                    "summary": pdf.pdf_summary,
                    "uploaded_at": str(pdf.uploaded_at),
                    "last_modified": str(pdf.last_modified)
        
                }
            )

        return result

    finally:
        db.close()

@router.get("/pdfs/search/{name}")
def search_pdf(name: str):

    db = SessionLocal()

    try:

        pdfs = (
            db.query(PDFData)
            .filter(
                PDFData.pdf_name.ilike(
                    f"%{name}%"
                )
            )
            .all()
        )

        result = []

        for pdf in pdfs:

            user = (
                db.query(User)
                .filter(
                    User.username ==
                    pdf.entry_by
                )
                .first()
            )

            result.append(
                {
                    "id": pdf.id,
                    "pdf_name": pdf.pdf_name,
                    "full_name":
                        user.full_name
                        if user else "",
                    "entry_by":
                        pdf.entry_by,
                    "pdf_type":
                        pdf.pdf_type,
                    "page_count":
                        pdf.page_count,
                    "summary":
                        pdf.pdf_summary,
                    "uploaded_at":
                        str(pdf.uploaded_at),
                    "last_modified":
                        str(pdf.last_modified)
                }
            )

        return result

    finally:
        db.close()

@router.get("/pending-pdfs")
def pending_pdfs():

    db = SessionLocal()

    try:

        pdfs = db.query(
            TempPDFData
        ).all()

        result = []

        for pdf in pdfs:

            user = (
                db.query(User)
                .filter(
                    User.username ==
                    pdf.entry_by
                )
                .first()
            )

            result.append(
                {
                    "id": pdf.id,
                    "pdf_name": pdf.pdf_name,
                    "full_name":
                        user.full_name
                        if user else "",
                    "entry_by":
                        pdf.entry_by,
                    "pdf_type":
                        pdf.pdf_type,
                    "page_count":
                        pdf.page_count,
                    "summary":
                        pdf.pdf_summary,
                    "uploaded_at":
                        str(pdf.uploaded_at)
                }
            )

        return result

    finally:
        db.close()

@router.post("/approve/{pdf_id}")
def approve_pdf(pdf_id: int):

    db = SessionLocal()

    try:

        temp_pdf = db.query(
            TempPDFData
        ).filter(
            TempPDFData.id == pdf_id
        ).first()

        if not temp_pdf:
            return {
                "error":
                "PDF not found"
            }

        master_pdf = PDFData(

            pdf_name=temp_pdf.pdf_name,

            entry_by=temp_pdf.entry_by,

            pdf_type=temp_pdf.pdf_type,

            page_count=temp_pdf.page_count,

            pdf_summary=temp_pdf.pdf_summary,

            pdf_file=temp_pdf.pdf_file,

            pdf_hash=temp_pdf.pdf_hash
        )

        db.add(master_pdf)

        db.commit()

        db.refresh(master_pdf)

        db.delete(temp_pdf)

        db.commit()

        return {
            "message":
            "Approved and moved to master database"
        }

    finally:
        db.close()

@router.delete("/reject/{pdf_id}")
def reject_pdf(pdf_id: int):

    db = SessionLocal()

    try:

        pdf = db.query(
            TempPDFData
        ).filter(
            TempPDFData.id == pdf_id
        ).first()

        if not pdf:
            return {
                "error":
                "PDF not found"
            }

        db.delete(pdf)

        db.commit()

        return {
            "message":
            "Rejected successfully"
        }

    finally:
        db.close()

@router.get("/dashboard")
def dashboard():

    db = SessionLocal()

    try:

        total_approved = db.query(
            PDFData
        ).count()

        total_pending = db.query(
            TempPDFData
        ).count()

        books = db.query(
            PDFData
        ).filter(
            PDFData.pdf_type == "book"
        ).count()

        receipts = db.query(
            PDFData
        ).filter(
            PDFData.pdf_type == "payment_receipt"
        ).count()

        certificates = db.query(
            PDFData
        ).filter(
            PDFData.pdf_type == "certificate"
        ).count()

        image_pdfs = db.query(
            PDFData
        ).filter(
            PDFData.pdf_type == "image_pdf"
        ).count()

        invoices = db.query(
            PDFData
        ).filter(
            PDFData.pdf_type == "invoice"
        ).count()

        return {

            "approved_pdfs":
            total_approved,

            "pending_pdfs":
            total_pending,

            "pdf_types": {

                "books":
                books,

                "payment_receipts":
                receipts,

                "certificates":
                certificates,

                "image_pdfs":
                image_pdfs,

                "invoices":
                invoices
            }
        }

    finally:
        db.close()

@router.get("/pdf-details/{pdf_id}")
def pdf_details(pdf_id: int):

    db = SessionLocal()

    try:

        pdf = db.query(
            PDFData
        ).filter(
            PDFData.id == pdf_id
        ).first()

        if not pdf:
            return {
                "error": "PDF not found"
            }

        return {
            "id": pdf.id,
            "pdf_name": pdf.pdf_name,
            "entry_by": pdf.entry_by,
            "pdf_type": pdf.pdf_type,
            "page_count": pdf.page_count,
            "summary": pdf.pdf_summary,
            "uploaded_at": str(pdf.uploaded_at),
            "last_modified": str(pdf.last_modified)
        }

    finally:
        db.close()

from fastapi.responses import StreamingResponse
from io import BytesIO

@router.get("/temp-pdf/{pdf_id}")
def open_temp_pdf(pdf_id: int):

    db = SessionLocal()

    try:

        pdf = db.query(
            TempPDFData
        ).filter(
            TempPDFData.id == pdf_id
        ).first()

        if not pdf:
            return {
                "error": "PDF not found"
            }

        return StreamingResponse(
            BytesIO(pdf.pdf_file),
            media_type="application/pdf"
        )

    finally:
        db.close()

from app.models import User
from passlib.hash import bcrypt

@router.post("/register")
def register(data: dict):
    db = SessionLocal()

    try:
        print("Received data:", data)

        full_name = data["full_name"]

        print("Full Name:", repr(full_name))
        print("Characters:", [c for c in full_name])

        full_name = full_name.strip()

        if not full_name.replace(" ", "").isalpha():
            return {
                "error":
                "Full Name can contain only letters and spaces."
            }

        existing_username = (
            db.query(User)
            .filter(User.username == data["username"])
            .first()
        )

        if existing_username:
            return {
                "error":
                "Username already exists"
            }

        existing_email = (
            db.query(User)
            .filter(User.email == data["email"])
            .first()
        )

        if existing_email:
            return {
                "error":
                "Email already registered"
            }

        password = data["password"]

        if not re.match(
            r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$',
            password
        ):
            return {
                "error":
                "Password is too weak"
            }

        user = User(
            full_name=full_name,
            username=data["username"],
            email=data["email"],
            password=bcrypt.hash(password),
            role="user"
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message":
            "User created successfully"
        }

    except Exception as e:
        db.rollback()
        print("REGISTER ERROR:")
        print(type(e))
        print(e)

        return {
            "error":
            str(e)
        }

    finally:
        db.close()

from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "smartpdf"

from passlib.hash import bcrypt

@router.post("/login")
def login(data: dict):

    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.email == data["email"]
        ).first()

        if not user:
            return {
                "message": "Invalid email or password"
            }

        if not bcrypt.verify(
            data["password"],
            user.password
        ):
            return {
                "message": "Invalid email or password"
            }

        return {
            "message": "Login successful",
            "username": user.username,
            "role": user.role
        }

    finally:
        db.close()

@router.get("/my-pdfs/{username}")
def my_pdfs(username: str):

    db = SessionLocal()

    try:

        pdfs = db.query(
            PDFData
        ).filter(
            PDFData.entry_by == username
        ).all()

        result = []

        for pdf in pdfs:
            result.append(
                {
                    "id": pdf.id,
                    "pdf_name": pdf.pdf_name,
                    "pdf_type": pdf.pdf_type,
                    "page_count": pdf.page_count,
                    "summary": pdf.pdf_summary,
                    "uploaded_at": str(
                        pdf.uploaded_at
                    ),
                    "pdf_link":
                    f"http://127.0.0.1:8000/pdf/{pdf.id}"
                }
            )

        return result

    finally:
        db.close()

@router.get("/users")
def get_users():

    db = SessionLocal()

    try:

        users = db.query(
            User
        ).all()

        result = []

        for user in users:

            result.append(
                {
                    "id": user.id,
                    "full_name": user.full_name,
                    "username":
                    user.username,
                    "email":
                    user.email,
                    "role":
                    user.role,
                    "created_at": str(
                        user.created_at
                    )
                }
            )

        return result

    finally:
        db.close()


@router.delete("/users/{user_id}")
def delete_user(user_id: int):

    db = SessionLocal()

    try:

        user = db.query(
            User
        ).filter(
            User.id == user_id
        ).first()

        if not user:
            return {
                "error":
                "User not found"
            }

        db.delete(user)

        db.commit()

        return {
            "message":
            "User deleted"
        }

    finally:
        db.close()

@router.put(
    "/users/{user_id}/{role}"
)
def change_role(
    user_id: int,
    role: str
):

    db = SessionLocal()

    try:

        user = db.query(
            User
        ).filter(
            User.id == user_id
        ).first()

        if not user:
            return {
                "error":
                "User not found"
            }

        user.role = role

        db.commit()

        return {
            "message":
            "Role updated"
        }

    finally:
        db.close()

@router.post("/forgot-password")
async def forgot_password(data: dict):

    db = SessionLocal()

    try:
        print("Received Email:", data["email"])

        user = db.query(User).filter(
            User.email == data["email"]
        ).first()

        print("User Found:", user)

        if not user:
            return {
                "error": "Email not found"
            }

        otp = str(randint(100000, 999999))

        user.otp = otp
        user.otp_expiry = (
            datetime.utcnow()
            + timedelta(minutes=5)
        )

        db.commit()

        return {
            "message": "OTP generated",
            "otp": otp
        }

    finally:
        db.close()

@router.post("/verify-otp")
def verify_otp(
    data: dict
):

    db = SessionLocal()

    try:

        user = db.query(User).filter(
            User.email == data["email"]
        ).first()

        if not user:
            return {
                "error":
                "User not found"
            }

        if user.otp != data["otp"]:
            return {
                "error":
                "Invalid OTP"
            }

        if (
            datetime.utcnow()
            >
            user.otp_expiry
        ):
            return {
                "error":
                "OTP Expired"
            }

        return {
            "message":
            "OTP Verified"
        }

    finally:
        db.close()

@router.post("/reset-password")
def reset_password(
    data: dict
):

    db = SessionLocal()

    try:

        user = db.query(User).filter(
            User.email == data["email"]
        ).first()

        if not user:
            return {
                "error":
                "User not found"
            }

        user.password = bcrypt.hash(
            data["password"]
        )

        user.otp = None
        user.otp_expiry = None

        db.commit()

        return {
            "message":
            "Password changed"
        }

    finally:
        db.close()

@router.get("/profile/{username}")
def get_profile(
    username: str
):

    db = SessionLocal()

    try:

        user = db.query(
            User
        ).filter(
            User.username
            == username
        ).first()

        if not user:
            return {
                "error":
                "User not found"
            }

        total_pdfs = (
            db.query(
                PDFData
            )
            .filter(
                PDFData.entry_by
                == username
            )
            .count()
        )

        return {

            "username":
            user.username,

            "email":
            user.email,

            "role":
            user.role,

            "created_at":
            user.created_at,

            "total_pdfs":
            total_pdfs
        }

    finally:
        db.close()

@router.get("/download-pdf/{pdf_id}")
async def download_pdf(pdf_id: int):

    db = SessionLocal()

    try:
        pdf = (
            db.query(TempPDFData)
            .filter(
                TempPDFData.id == pdf_id
            )
            .first()
        )

        if not pdf:
            return {
                "error": "PDF not found"
            }

        return StreamingResponse(
            io.BytesIO(pdf.pdf_file),
            media_type="application/pdf",
            headers={
                "Content-Disposition":
                f"attachment; filename={pdf.pdf_name}"
            }
        )

    finally:
        db.close()

@router.delete("/delete-pdf/{pdf_id}")
async def delete_pdf(pdf_id: int):

    db = SessionLocal()

    try:
        pdf = (
            db.query(PDFData)
            .filter(
                PDFData.id == pdf_id
            )
            .first()
        )

        if not pdf:
            return {
                "error": "PDF not found"
            }

        db.delete(pdf)
        db.commit()

        return {
            "message":
            "PDF deleted successfully"
        }

    finally:
        db.close()

@router.get("/users/search/{name}")
def search_users(name: str):

    db = SessionLocal()

    try:

        users = (
            db.query(User)
            .filter(
                User.username.ilike(
                    f"%{name}%"
                )
            )
            .all()
        )

        result = []

        for user in users:
            result.append({
                "id": user.id,
                "full_name":
                    user.full_name,
                "username":
                    user.username,
                "email":
                    user.email,
                "role":
                    user.role
            })

        return result

    finally:
        db.close()

@router.get("/users/search-by-pdf/{pdf_name}")
def search_users_by_pdf(pdf_name: str):

    db = SessionLocal()

    try:
        pdfs = (
            db.query(PDFData)
            .filter(
                PDFData.pdf_name.ilike(
                    f"%{pdf_name}%"
                )
            )
            .all()
        )

        result = []

        usernames = set()

        for pdf in pdfs:

            usernames.add(
                pdf.entry_by
            )

        for username in usernames:

            user = (
                db.query(User)
                .filter(
                    User.username ==
                    username
                )
                .first()
            )

            if user:
                result.append(
                    {
                        "id": user.id,
                        "full_name":
                            user.full_name,
                        "username":
                            user.username,
                        "email":
                            user.email,
                        "role":
                            user.role,
                        "created_at":
                            str(
                                user.created_at
                            )
                    }
                )

        return result

    finally:
        db.close()

@router.get(
    "/my-pdfs/search/{username}/{name}"
)
def search_my_pdfs(
    username: str,
    name: str
):

    db = SessionLocal()

    try:

        pdfs = (
            db.query(PDFData)
            .filter(
                PDFData.entry_by ==
                username,
                PDFData.pdf_name.ilike(
                    f"%{name}%"
                )
            )
            .all()
        )

        result = []

        for pdf in pdfs:

            result.append(
                {
                    "id": pdf.id,
                    "pdf_name":
                        pdf.pdf_name,
                    "pdf_type":
                        pdf.pdf_type,
                    "page_count":
                        pdf.page_count,
                    "pdf_link":
                        f"http://127.0.0.1:8000/pdf/{pdf.id}"
                }
            )

        return result

    finally:
        db.close()