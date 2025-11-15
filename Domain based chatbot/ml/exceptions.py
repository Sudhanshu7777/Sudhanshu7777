"""Custom exceptions for ML classification pipeline."""


class ClassificationError(Exception):
    """Base exception for classification errors."""


class InvalidImageError(ClassificationError):
    """Raised when image format is invalid or cannot be processed."""


class LowConfidenceError(ClassificationError):
    """Raised when prediction confidence is below threshold."""

    def __init__(self, message: str, confidence: float | None = None) -> None:
        super().__init__(message)
        self.confidence = confidence


class ModelNotReadyError(ClassificationError):
    """Raised when model is not loaded or ready for predictions."""
