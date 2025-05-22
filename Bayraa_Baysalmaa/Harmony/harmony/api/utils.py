# utils.py
import base64
from django.core.files.base import ContentFile
from django.conf import settings
import os

def get_base64_image(image_field):
    if not image_field:
        return None
    try:
        with open(os.path.join(settings.MEDIA_ROOT, image_field.name), "rb") as img_file:
            encoded = base64.b64encode(img_file.read()).decode('utf-8')
            return f"data:image/jpeg;base64,{encoded}"
    except Exception as e:
        print(f"Base64 error: {e}")
        return None
