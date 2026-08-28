from app.database import SessionLocal
from app.models import TempPDFData


def save_to_db(
    file_name,
    data,
    page_count,
    pdf_bytes,
    entry_by,
    pdf_hash
):

    db = SessionLocal()

    try:

        pdf = TempPDFData(

            pdf_name=file_name,

            entry_by=entry_by,

            pdf_type=data.get(
                "pdf_type"
            ),

            page_count=page_count,

            pdf_summary=data.get(
                "summary"
            ),

            pdf_file=pdf_bytes,

             pdf_hash=pdf_hash
        )

        db.add(pdf)
        db.commit()
        db.refresh(pdf)

    finally:
        db.close()