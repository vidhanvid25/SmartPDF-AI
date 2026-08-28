import easyocr
import fitz
import cv2
import numpy as np


reader = easyocr.Reader(["en"], gpu=False)


def preprocess(img):

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

    return thresh


def extract_text_from_scanned_pdf(pdf_path):

    text = ""

    pdf = fitz.open(pdf_path)

    for page_num in range(len(pdf)):

        page = pdf.load_page(page_num)

        pix = page.get_pixmap(matrix=fitz.Matrix(3, 3))

        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)

        processed = preprocess(img)

        results = reader.readtext(processed, detail=0)

        text += (f"\nPAGE {page_num+1}\n")

        for line in results:
            text += line + "\n"

    return text