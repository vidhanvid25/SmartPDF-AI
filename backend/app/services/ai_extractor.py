from app.services.image_analyzer import analyze_image_pdf

import json
import re
import ollama


def extract_structured_data(
    text,
    pdf_path=None
):

    # image only pdf
    if text == "image-only":

        return analyze_image_pdf(
            pdf_path
        )

    # AI prompt
    prompt = f"""
You are a smart document analysis AI.

Analyze the PDF carefully.

Return ONLY VALID JSON.

Required JSON format:

{{
  "pdf_type": "",
  "summary": "",
  "fields": {{}},
  "table_data": []
}}

Rules:

- Output ONLY valid JSON
- No markdown
- No explanation
- No ```json
- Always return valid JSON

PDF Type Examples:

- payment_receipt
- certificate
- admit_card
- invoice
- student_list
- image_pdf
- book
- report
- document

Important Rules:

1. Extract important metadata
(name, title, author, amount,
date, roll number, etc.)

2. Add short summary.

3. Only extract table_data
if it is a REAL structured table.

4. DO NOT extract
table of contents.

5. For books, reports,
notes, receipts,
invoices,
certificates,
admit cards
keep table_data empty.

6. Never generate huge outputs.

7. Never create fake table rows.

Example:

{{
  "pdf_type": "payment_receipt",
  "summary":
  "Payment receipt",

  "fields": {{
      "amount":"14590",
      "date":"23-04-2026"
  }},

  "table_data":[]
}}

PDF TEXT (START):
{text[:3000]}

PDF TEXT (MIDDLE):
{text[len(text)//2:len(text)//2 + 3000]}

PDF TEXT (END):
{text[-3000:]}
"""

    try:

        response = ollama.chat(
            model="llama3.2:3b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        result = response[
            "message"
        ]["content"]

        print("\nResponse:")
        print(result)

        # Extract JSON only
        json_match = re.search(
            r"\{.*\}",
            result,
            re.DOTALL
        )

        if json_match:
            result = json_match.group(0)

        # Clean JSON
        result = result.replace(
            "\n",
            " "
        )

        result = result.replace(
            "\t",
            " "
        )

        result = re.sub(
            r",\s*}",
            "}",
            result
        )

        result = re.sub(
            r",\s*]",
            "]",
            result
        )

        # Parse JSON
        try:

            parsed = json.loads(
                result
            )

            return parsed

        except Exception as e:

            print(
                "Broken JSON. Removing table data"
            )

            try:

                # remove entire table_data
                result = re.sub(
                    r'"table_data"\s*:\s*\[.*',
                    '"table_data":[]}',
                    result,
                    flags=re.DOTALL
                )

                parsed = json.loads(
                    result
                )

                return parsed

            except Exception as e2:

                print(
                    "JSON ERROR:",
                    e2
                )

                return {
                    "pdf_type":
                    "unknown",

                    "summary":
                    "Could not fully extract",

                    "fields": {},

                    "table_data": []
                }

    except Exception as e:

        print(
            "AI Error:",
            e
        )

        return {
            "pdf_type":
            "unknown",

            "summary":
            "AI extraction failed",

            "fields": {},

            "table_data": []
        }