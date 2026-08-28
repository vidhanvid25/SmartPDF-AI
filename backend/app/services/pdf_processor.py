import fitz

from app.services.ocr_service import (extract_text_from_scanned_pdf)


def extract_pdf_text(pdf_path):

    # Open PDF
    doc = fitz.open(pdf_path)

    # Count pages
    page_count = len(doc)

    # Store extracted text
    text = ""

    # Normal PDF text extraction
    for page in doc:

        text += page.get_text()

    # OCR fallback
    # If PDF has little/no text
    if len(text.strip()) < 50:

        print("\nUsing OCR\n")

        text = extract_text_from_scanned_pdf(pdf_path)

        print("\nOCR TEXT:\n")

        print(text[:500])

    # Detect image-only PDF
    cleaned_text = text.strip()

    # Too little text
    if len(cleaned_text) < 30:

        print("\nImage PDF Detected\n")

        text = "image-only"

    # OCR junk detection
    elif len(cleaned_text.split()) < 10:

        print("\nImage PDF Detected\n")

        text = "image-only"

    # Debug output
    print("\nExtracted Text\n")

    print(text[:5000])

    return text, page_count