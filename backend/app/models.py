from sqlalchemy.orm import declarative_base
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    LargeBinary
)
from datetime import datetime
from sqlalchemy import DateTime

Base = declarative_base()


class PDFData(Base):

    __tablename__ = "pdf_data"

    id = Column(Integer, primary_key=True)

    pdf_name = Column(String)

    entry_by = Column(String)

    pdf_type = Column(String)

    page_count = Column(Integer)

    pdf_summary = Column(Text)

    pdf_file = Column(LargeBinary)

    pdf_hash = Column(
        String,
        unique=True
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    last_modified = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

class TempPDFData(Base):

    __tablename__ = "temp_pdf_data"

    id = Column(Integer, primary_key=True)

    pdf_name = Column(String)

    entry_by = Column(String)

    pdf_type = Column(String)

    page_count = Column(Integer)

    pdf_summary = Column(Text)

    pdf_file = Column(LargeBinary)

    pdf_hash = Column(
        String,
        unique=True
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    last_modified = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    full_name = Column(
        String
    )

    username = Column(String, unique=True, nullable=False)

    email = Column(String, unique=True)

    password = Column(String)

    role = Column(String, default="user")

    otp = Column(String)

    otp_expiry = Column(DateTime)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )