# utils.py
import base64
import uuid
from django.core.files.base import ContentFile

def base64_to_image(base64_string, upload_to):
    format, imgstr = base64_string.split(';base64,')  # Extract format and base64 string
    ext = format.split('/')[-1]  # Get file extension
    img_data = base64.b64decode(imgstr)  # Decode base64 string
    file_name = f"{upload_to}/{uuid.uuid4()}.{ext}"  # Define the file name
    return ContentFile(img_data, name=file_name)
