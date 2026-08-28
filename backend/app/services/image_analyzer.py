import ollama
import fitz
import tempfile
import json
import re


def analyze_image_pdf(pdf_path):

    try:

        # Open PDF
        doc = fitz.open(pdf_path)

        page = doc[0]

        pix = page.get_pixmap()

        # Temporary image
        temp_path = tempfile.mktemp(suffix=".png")

        pix.save(temp_path)

        # Vision AI
        response = ollama.chat(
            model="llava",
            options={
                "num_gpu": 0
            },
            messages=[
                {
                    "role": "user",
                    "content": """
Analyze this image carefully.

Return ONLY VALID JSON.

Format:

{
  "pdf_type": "image_pdf",
  "summary": "",
  "fields": {
      "contains_person": false,
      "activity": "",
      "clothing": "",
      "environment": "",
      "contains_text": false
  },
  "table_data": []
}

Rules:
- Describe what is visible
- If a person exists, explain what the person is doing
- Describe clothing
- Describe background
- Keep summary short
- Output ONLY JSON
""",
                    "images": [temp_path]
                }
            ]
        )

        result = response[
            "message"
        ]["content"]

        print("\nImage AI Response:\n")

        print(result)

        # Remove markdown
        result = result.replace("json", "")

        result = result.replace("```", "")

        result = result.strip()

        # Extract JSON only
        json_match = re.search(r"\{.*\}", result, re.DOTALL)

        if json_match:

            result = json_match.group(0)

        # Parse JSONs
        parsed = json.loads(result)

        # Auto-create summary if missing
        if not parsed.get("summary"):

            activity = parsed.get(
                "fields",
                {}
            ).get(
                "activity",
                "present"
            )

            environment = parsed.get(
                "fields",
                {}
            ).get(
                "environment",
                "unknown location"
            )

            parsed["summary"] = (
                f"Person {activity.lower()} in "
                f"{environment.lower()}."
            )
        print( "\nParsed Image JSON:\n")

        print(parsed)

        return parsed

    except Exception as e:

        print("Image Analyzer Error:", e)

        return {
            "pdf_type":
            "image_pdf",

            "summary":
            "Could not analyze image PDF",

            "fields": {
                "contains_text":
                False
            },

            "table_data": []
        }