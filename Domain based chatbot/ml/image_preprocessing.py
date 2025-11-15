"""Image preprocessing utilities for waste classification."""

from __future__ import annotations

import io
from typing import Tuple

import cv2
import numpy as np
from PIL import Image

from .exceptions import InvalidImageError


IMAGE_SIZE = (224, 224)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def validate_image_format(file_extension: str) -> None:
    """Validate the image file extension."""
    if file_extension.lower() not in ALLOWED_EXTENSIONS:
        raise InvalidImageError(
            f"Invalid image format: {file_extension}. Allowed formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )


def read_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """Read image from bytes and convert to RGB numpy array."""
    try:
        buffer = io.BytesIO(image_bytes)
        with Image.open(buffer) as img:
            img = img.convert("RGB")
            return np.array(img)
    except Exception as exc:  # pragma: no cover - conversion edge cases
        raise InvalidImageError(f"Failed to read image: {exc}") from exc


def convert_to_grayscale(img_array: np.ndarray) -> np.ndarray:
    """Convert image to grayscale (if needed for certain models)."""
    if len(img_array.shape) == 3 and img_array.shape[2] == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        return np.expand_dims(gray, axis=-1)
    return img_array


def augment_image(img_array: np.ndarray) -> np.ndarray:
    """Apply lightweight augmentation (rotation and brightness shifts)."""
    angle = float(np.random.uniform(-8, 8))
    height, width = img_array.shape[:2]
    center = (width // 2, height // 2)

    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(img_array, rotation_matrix, (width, height), borderMode=cv2.BORDER_REFLECT)

    brightness_delta = int(np.random.randint(-20, 20))
    augmented = cv2.convertScaleAbs(rotated, alpha=1.0, beta=brightness_delta)

    return augmented


def preprocess_image(
    image_bytes: bytes,
    target_size: Tuple[int, int] = IMAGE_SIZE,
    normalize: bool = True,
    grayscale: bool = False,
    augment: bool = False,
) -> np.ndarray:
    """Preprocess image for model inference.

    Args:
        image_bytes: Raw image bytes
        target_size: Target dimensions (width, height)
        normalize: Whether to normalize pixel values to [0, 1]
        grayscale: Whether to convert to grayscale
        augment: Apply light augmentation (useful for test endpoint)

    Returns:
        Preprocessed image as numpy array with shape (1, height, width, channels)
    """
    img_array = read_image_from_bytes(image_bytes)

    if augment:
        img_array = augment_image(img_array)

    if grayscale:
        img_array = convert_to_grayscale(img_array)

    img_resized = cv2.resize(img_array, target_size, interpolation=cv2.INTER_AREA)

    if normalize:
        img_resized = img_resized.astype(np.float32) / 255.0
    else:
        img_resized = img_resized.astype(np.float32)

    if img_resized.ndim == 2:
        img_resized = np.expand_dims(img_resized, axis=-1)

    return np.expand_dims(img_resized, axis=0)
