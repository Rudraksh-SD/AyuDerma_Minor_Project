import io
from PIL import Image
import numpy as np
from fastapi import HTTPException

IMAGE_SIZE = (224, 224)
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB Limit
ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

def validate_image_file(file_content: bytes, content_type: str = None):
    """
    Validate that the uploaded file is a valid image and within size limits.
    """
    if not file_content or len(file_content) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    if len(file_content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Uploaded image exceeds maximum size limit of 10MB."
        )

    if content_type and content_type.lower() not in ALLOWED_MIME_TYPES:
        # Note: some clients may send image/pjpeg or octet-stream, we will attempt PIL verification
        pass

    try:
        image = Image.open(io.BytesIO(file_content))
        image.verify()  # Verify image integrity
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or corrupted image file. Error: {str(e)}"
        )

def preprocess_image(file_content: bytes) -> np.ndarray:
    """
    Convert image bytes to RGB, resize to 224x224, and convert to numpy float32 array
    suitable for EfficientNetB0 (which expects pixel values in range [0, 255]).
    """
    validate_image_file(file_content)

    try:
        image = Image.open(io.BytesIO(file_content)).convert("RGB")
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process image file. Error: {str(e)}"
        )

    # Resize image to target (224, 224)
    image = image.resize(IMAGE_SIZE)

    # Convert to float32 numpy array [0, 255]
    image_array = np.array(image, dtype=np.float32)

    # Add batch dimension -> (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)

    return image_array
