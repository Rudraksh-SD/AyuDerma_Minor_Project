import os
import json
from pathlib import Path
import numpy as np
import tensorflow as tf
from typing import Dict, Any, Tuple, List

try:
    from backend.utils.image_processing import preprocess_image
except ImportError:
    from utils.image_processing import preprocess_image

class ModelService:
    def __init__(self):
        self.model = None
        self.class_names: Dict[int, str] = {}
        self.model_path: str = ""
        self.load_error: str = None
        self._is_loaded = False

    def load_model_and_classes(self):
        """
        Loads the TensorFlow Keras model and class mapping.
        This method MUST be called once when the application starts up.
        """
        if self._is_loaded:
            return

        base_dir = Path(__file__).resolve().parent.parent

        # Candidate paths for model file using pathlib
        env_model_path = os.getenv("MODEL_PATH")
        candidate_model_paths = [
            Path(env_model_path) if env_model_path else None,
            base_dir / "final_skin_disease_model.keras",
            base_dir / "model" / "final_skin_disease_model.keras",
        ]

        found_model_path = None
        for path in candidate_model_paths:
            if path and path.exists():
                found_model_path = path
                break

        if not found_model_path:
            valid_paths_str = ", ".join(str(p) for p in candidate_model_paths if p is not None)
            self.load_error = f"Model file not found in search paths: {valid_paths_str}"
            print(f"ERROR: {self.load_error}")
            return

        self.model_path = str(found_model_path)
        print(f"Loading Keras model from: {self.model_path}")

        try:
            # Load with compile=False to avoid missing custom loss/metric compilation errors
            self.model = tf.keras.models.load_model(self.model_path, compile=False)
            print("Keras model loaded successfully!")
        except Exception as e:
            self.load_error = f"Failed to load Keras model: {str(e)}"
            print(f"ERROR: {self.load_error}")
            return

        # Candidate paths for class_names / class_indices file using pathlib
        env_class_path = os.getenv("CLASS_NAMES_PATH")
        candidate_class_paths = [
            Path(env_class_path) if env_class_path else None,
            base_dir / "model" / "class_names.json",
            base_dir / "class_indices.json",
            base_dir / "class_names.json",
        ]

        found_class_path = None
        for path in candidate_class_paths:
            if path and path.exists():
                found_class_path = path
                break

        if found_class_path:
            try:
                with open(found_class_path, "r", encoding="utf-8") as f:
                    class_data = json.load(f)

                if isinstance(class_data, dict):
                    self.class_names = {int(k): str(v) for k, v in class_data.items()}
                else:
                    self.class_names = {i: str(name) for i, name in enumerate(class_data)}

                print(f"Loaded {len(self.class_names)} classes from {found_class_path}:")
                for idx in sorted(self.class_names.keys()):
                    print(f"  [{idx}] {self.class_names[idx]}")
            except Exception as e:
                print(f"WARNING: Error reading class names file ({found_class_path}): {e}")
        else:
            print("WARNING: No class names file found. Using index fallback.")

        self._is_loaded = True

    def is_loaded(self) -> bool:
        return self.model is not None

    def predict_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Executes prediction on the uploaded image bytes.
        Returns:
            predicted_class (str),
            class_index (int),
            confidence (float between 0.0 and 1.0),
            top_predictions (list of dicts)
        """
        if not self.is_loaded():
            raise RuntimeError(f"Model service is not loaded. Details: {self.load_error or 'Unknown error'}")

        # Preprocess image into tensor (1, 224, 224, 3)
        image_tensor = preprocess_image(image_bytes)

        # Run inference
        raw_predictions = self.model.predict(image_tensor, verbose=0)
        probabilities = raw_predictions[0]

        predicted_index = int(np.argmax(probabilities))
        confidence = float(probabilities[predicted_index])
        predicted_class = self.class_names.get(predicted_index, f"Class_{predicted_index}")

        # Top 3 predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_predictions = []
        for idx in top_indices:
            idx_int = int(idx)
            cls_name = self.class_names.get(idx_int, f"Class_{idx_int}")
            top_predictions.append({
                "class_name": cls_name,
                "confidence": round(float(probabilities[idx_int]), 4)
            })

        return {
            "predicted_class": predicted_class,
            "predicted_index": predicted_index,
            "confidence": round(confidence, 4),
            "top_predictions": top_predictions
        }

# Global singleton instance
model_service = ModelService()
