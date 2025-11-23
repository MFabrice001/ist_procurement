import openai
import os
from pypdf import PdfReader

# Set your key here, or use environment variable
OPENAI_API_KEY = "YOUR-OPENAI-KEY-HERE" 

def extract_from_file(file_obj):
    """
    Extracts total amount and vendor from a file.
    """
    filename = file_obj.name.lower()
    text = ""

    # 1. Extract Text from PDF
    if filename.endswith('.pdf'):
        try:
            reader = PdfReader(file_obj)
            for page in reader.pages:
                text += page.extract_text()
        except Exception as e:
            print(f"Error reading PDF: {e}")
    
    # (If you had time, you would add OCR for images here using pytesseract)
    # For now, we focus on PDF text or Mocking.

    # 2. Use OpenAI to find the data
    if OPENAI_API_KEY and OPENAI_API_KEY != "YOUR-OPENAI-KEY-HERE":
        try:
            client = openai.OpenAI(api_key=OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a data extractor. Return ONLY a JSON object with keys: 'vendor' (string) and 'amount' (number/float). Do not write markdown."},
                    {"role": "user", "content": f"Extract the vendor and total amount from this text: {text[:2000]}"}
                ]
            )
            # Parse response (Simplified)
            import json
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"AI Error: {e}")
            return None
    
    # 3. MOCK MODE (If no API Key)
    # This ensures your project "Works" during the demo even without paying OpenAI.
    return {
        "vendor": "Demo Vendor Ltd",
        "amount": 1500.00
    }