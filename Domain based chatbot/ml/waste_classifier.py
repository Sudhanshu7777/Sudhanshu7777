"""Waste classification using TensorFlow Lite or heuristic fallback."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np

from .disposal_instructions import CATEGORY_LABELS, get_guidance
from .exceptions import (
    ClassificationError,
    InvalidImageError,
    LowConfidenceError,
    ModelNotReadyError,
)
from .image_preprocessing import IMAGE_SIZE, preprocess_image, validate_image_format

logger = logging.getLogger(__name__)

# Attempt to import a TensorFlow Lite interpreter implementation
InterpreterType = Any
try:  # pragma: no cover - import resolution environment specific
    from tflite_runtime.interpreter import Interpreter as TFLiteInterpreter  # type: ignore
except (ImportError, AttributeError):  # pragma: no cover - optional dependency
    try:
        from tensorflow.lite.python.interpreter import Interpreter as TFLiteInterpreter  # type: ignore
    except (ImportError, AttributeError):  # pragma: no cover - optional dependency
        TFLiteInterpreter = None  # type: ignore

CONFIDENCE_THRESHOLD = 0.60


@dataclass
class ClassificationResult:
    waste_type: str
    category: str
    confidence: float
    disposal_instructions: str
    model_timestamp: str
    all_predictions: Dict[str, float]
    mock: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "waste_type": self.waste_type,
            "category": self.category,
            "confidence": round(self.confidence, 4),
            "disposal_instructions": self.disposal_instructions,
            "model_timestamp": self.model_timestamp,
            "all_predictions": {
                label: round(score, 4) for label, score in self.all_predictions.items()
            },
            "mock": self.mock,
        }


class WasteClassifier:
    """TensorFlow Lite waste classifier with heuristic fallback."""

    def __init__(self, model_path: Optional[str] = None) -> None:
        base_dir = Path(__file__).resolve().parent
        default_model = base_dir / "models" / "waste_classifier.tflite"
        self.model_path = Path(model_path) if model_path else default_model
        self.categories = CATEGORY_LABELS
        self.model_loaded_at: Optional[datetime] = None
        self._interpreter: Optional[InterpreterType] = None
        self._input_details: Optional[list] = None
        self._output_details: Optional[list] = None
        self._input_size = IMAGE_SIZE
        self._expects_grayscale = False
        self._uses_mock = False
        self._load_model()

    @property
    def uses_mock(self) -> bool:
        return self._uses_mock

    def _load_model(self) -> None:
        """Attempt to load TensorFlow Lite model, fall back to heuristic."""
        if TFLiteInterpreter and self.model_path.exists():
            try:
                logger.info("Loading TensorFlow Lite model from %s", self.model_path)
                interpreter = TFLiteInterpreter(model_path=str(self.model_path))
                interpreter.allocate_tensors()
                self._interpreter = interpreter
                self._input_details = interpreter.get_input_details()
                self._output_details = interpreter.get_output_details()

                if self._input_details:
                    shape = self._input_details[0]["shape"]
                    if len(shape) == 4:
                        height = int(shape[1])
                        width = int(shape[2])
                        channels = int(shape[3])
                        self._input_size = (width, height)
                        self._expects_grayscale = channels == 1

                self.model_loaded_at = datetime.utcfromtimestamp(self.model_path.stat().st_mtime)
                self._uses_mock = False
                logger.info("TensorFlow Lite model loaded successfully")
                return
            except Exception as exc:  # pragma: no cover - runtime dependent
                logger.warning("Unable to load TFLite model: %s", exc)

        self.model_loaded_at = datetime.utcnow()
        self._uses_mock = True
        logger.info("Using heuristic waste classifier (mock mode)")

    def is_ready(self) -> bool:
        return self.model_loaded_at is not None

    def classify(
        self,
        image_bytes: bytes,
        filename: Optional[str] = None,
        augment: bool = False,
    ) -> Dict[str, Any]:
        if not self.is_ready():
            raise ModelNotReadyError("Waste classifier not ready")

        if not image_bytes:
            raise InvalidImageError("No image content provided")

        if filename:
            validate_image_format(Path(filename).suffix or ".jpg")

        preprocessed = preprocess_image(
            image_bytes,
            target_size=self._input_size,
            grayscale=self._expects_grayscale,
            augment=augment and self._uses_mock,
        )

        predictions = self._invoke_model(preprocessed)
        predictions = self._normalize_predictions(predictions)

        best_index = int(np.argmax(predictions))
        confidence = float(predictions[best_index])

        if confidence < CONFIDENCE_THRESHOLD:
            raise LowConfidenceError(
                f"Prediction confidence ({confidence:.2%}) below threshold ({CONFIDENCE_THRESHOLD:.0%})",
                confidence=confidence,
            )

        category = self.categories[best_index]
        guidance = get_guidance(category)
        timestamp = (
            self.model_loaded_at.isoformat() if self.model_loaded_at else datetime.utcnow().isoformat()
        )

        result = ClassificationResult(
            waste_type=guidance.waste_type,
            category=category,
            confidence=confidence,
            disposal_instructions=guidance.instructions,
            model_timestamp=timestamp,
            all_predictions={label: float(score) for label, score in zip(self.categories, predictions)},
            mock=self._uses_mock,
        )

        logger.info("Classified image as %s (confidence %.1f%%)", category, confidence * 100)
        return result.to_dict()

    def _invoke_model(self, image_batch: np.ndarray) -> np.ndarray:
        if not self._uses_mock and self._interpreter and self._input_details and self._output_details:
            input_tensor = image_batch.astype(self._input_details[0]["dtype"], copy=False)
            self._interpreter.set_tensor(self._input_details[0]["index"], input_tensor)
            self._interpreter.invoke()
            output = self._interpreter.get_tensor(self._output_details[0]["index"])
            return output[0]

        # Heuristic classifier fallback
        return self._heuristic_prediction(image_batch[0])

    def _heuristic_prediction(self, image: np.ndarray) -> np.ndarray:
        """Generate mock predictions based on simple image statistics."""
        # Ensure image has three channels for consistent heuristics
        if image.ndim == 2:
            image = np.repeat(image[..., np.newaxis], 3, axis=-1)
        elif image.shape[-1] == 1:
            image = np.repeat(image, 3, axis=-1)

        # Compute simple statistics
        mean_channels = image.mean(axis=(0, 1))
        brightness = image.mean()
        saturation = float(np.max(mean_channels) - np.min(mean_channels))
        
        # Start with base scores
        scores = np.full(len(self.categories), 0.05, dtype=np.float32)

        # Organic: greener images (high green channel relative to others)
        green_dominance = float(mean_channels[1]) - float((mean_channels[0] + mean_channels[2]) / 2)
        green_ratio = float(mean_channels[1]) / (float(mean_channels[0]) + float(mean_channels[2]) + 0.01)
        scores[self.categories.index("Organic")] += max(0, green_dominance * 10.0 + green_ratio * 2.0)

        # Plastic: bright blue/colorful (high saturation, blue-ish)
        blue_score = float(mean_channels[2]) - float((mean_channels[0] + mean_channels[1]) / 2)
        scores[self.categories.index("Plastic")] += max(0, blue_score * 6.0 + saturation * 4.0)

        # Recyclable: neutral balanced colors, medium brightness
        balance_score = 1.0 - float(np.std(mean_channels)) * 3.0
        brightness_mid = 1.0 - abs(brightness - 0.5) * 2.0
        scores[self.categories.index("Recyclable")] += max(0, (balance_score + brightness_mid) * 3.0)

        # Metal: high brightness, low saturation (metallic/gray)
        metal_score = brightness * 5.0 - saturation * 2.0
        scores[self.categories.index("Metal")] += max(0, metal_score * 2.0)

        # E-Waste: dark images
        darkness_score = (1.0 - brightness) * 3.0
        scores[self.categories.index("E-Waste")] += max(0, darkness_score * 2.5)

        # Hazardous: strong reds or very dark
        red_dominance = float(mean_channels[0]) - float((mean_channels[1] + mean_channels[2]) / 2)
        hazard_score = max(red_dominance * 6.0, (1.0 - brightness) * 2.0)
        scores[self.categories.index("Hazardous")] += max(0, hazard_score * 1.5)

        # Mixed: moderate values across the board
        mixed_score = 1.2 + (0.5 - abs(brightness - 0.4))
        scores[self.categories.index("Mixed")] += max(0, mixed_score)

        # Add small random noise for variety
        noise = np.random.default_rng().uniform(-0.1, 0.1, size=scores.shape)
        scores = np.clip(scores + noise.astype(np.float32), 0.05, 50.0)

        return scores

    @staticmethod
    def _normalize_predictions(predictions: np.ndarray) -> np.ndarray:
        preds = np.asarray(predictions, dtype=np.float32).flatten()
        if preds.sum() <= 0 or np.any(preds < 0) or np.max(preds) > 1:
            exps = np.exp(preds - np.max(preds))
            preds = exps / exps.sum()
        else:
            preds = preds / preds.sum()
        return preds

    def generate_mock_result(self) -> Dict[str, Any]:
        """Expose mock classification for testing endpoint without an image."""
        rng = np.random.default_rng()
        predictions = rng.dirichlet(np.full(len(self.categories), 0.8))
        best_idx = int(np.argmax(predictions))
        confidence = float(predictions[best_idx])

        # Ensure confidence above threshold for demonstration
        if confidence < CONFIDENCE_THRESHOLD:
            predictions[best_idx] += CONFIDENCE_THRESHOLD - confidence + 0.05
            predictions = predictions / predictions.sum()
            confidence = float(predictions[best_idx])

        category = self.categories[best_idx]
        guidance = get_guidance(category)

        timestamp = (
            self.model_loaded_at.isoformat() if self.model_loaded_at else datetime.utcnow().isoformat()
        )

        result = ClassificationResult(
            waste_type=guidance.waste_type,
            category=category,
            confidence=confidence,
            disposal_instructions=guidance.instructions,
            model_timestamp=timestamp,
            all_predictions={label: float(score) for label, score in zip(self.categories, predictions)},
            mock=True,
        )
        return result.to_dict()
