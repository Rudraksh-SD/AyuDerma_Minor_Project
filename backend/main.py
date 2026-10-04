import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Query, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

try:
    from backend.services.model_service import model_service
    from backend.services.supabase_service import (
        fetch_disease_data,
        is_database_configured,
        save_scan_record_to_supabase,
        get_user_progress_data
    )
    from backend.schemas.response_models import (
        PredictResponse,
        HealthResponse,
        PredictionDetail,
        TopPrediction,
        DiseaseInfo,
        AyurvedicRecommendation,
        DietRecommendation,
        ProgressResponse
    )
except ImportError:
    from services.model_service import model_service
    from services.supabase_service import (
        fetch_disease_data,
        is_database_configured,
        save_scan_record_to_supabase,
        get_user_progress_data
    )
    from schemas.response_models import (
        PredictResponse,
        HealthResponse,
        PredictionDetail,
        TopPrediction,
        DiseaseInfo,
        AyurvedicRecommendation,
        DietRecommendation,
        ProgressResponse
    )

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan context manager.
    Loads the trained TensorFlow/Keras model ONCE upon startup.
    """
    print("==================================================")
    print("Starting AyuDerma FastAPI Application...")
    print("==================================================")
    model_service.load_model_and_classes()
    yield
    print("Shutting down AyuDerma FastAPI Application...")

app = FastAPI(
    title="AyuDerma Skin Disease Detection & Ayurvedic Analysis API",
    description="FastAPI service serving efficient skin disease prediction model and Supabase Ayurvedic medical data integration.",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
frontend_url = os.getenv("FRONTEND_URL", "")
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
]
if frontend_url:
    for url in frontend_url.split(","):
        cleaned_url = url.strip()
        if cleaned_url and cleaned_url not in allowed_origins:
            allowed_origins.append(cleaned_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", summary="API Root", tags=["Root"])
def root():
    """Returns basic API status and configuration overview."""
    return {
        "status": "online",
        "service": "AyuDerma Skin Disease FastAPI Backend",
        "model_loaded": model_service.is_loaded(),
        "database_configured": is_database_configured(),
        "class_count": len(model_service.class_names),
        "classes": list(model_service.class_names.values())
    }

@app.get("/health", response_model=HealthResponse, summary="Backend Health Check", tags=["Health"])
def health_check():
    """
    Health check endpoint verifying TensorFlow model loading and Supabase configuration state.
    """
    is_model_ready = model_service.is_loaded()
    is_db_ready = is_database_configured()

    return HealthResponse(
        status="healthy" if is_model_ready else "degraded",
        model_loaded=is_model_ready,
        database_configured=is_db_ready,
        model_path=model_service.model_path,
        loaded_classes_count=len(model_service.class_names)
    )

@app.post("/predict", response_model=PredictResponse, summary="Predict Skin Disease & Save Scan Record", tags=["Prediction"])
async def predict_skin_disease(
    request: Request,
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    """
    Predict skin disease from an uploaded skin image file and save scan record.
    
    - Accepts `multipart/form-data` with field `file` and optional `user_id`.
    - Validates image file format (JPG, PNG, WEBP) and size (Max 10MB).
    - Preprocesses image tensor to 224x224 RGB.
    - Executes EfficientNetB0 Keras model inference.
    - Queries Supabase for disease details, Ayurvedic remedies, and diet recommendations.
    - Saves image to Supabase Storage 'skin-scans/{user_id}/{scan_id}.jpg' and inserts row into 'skin_scans' table.
    - Returns structured JSON response.
    """
    if not model_service.is_loaded():
        raise HTTPException(
            status_code=503,
            detail=f"Machine Learning model is not loaded on server. {model_service.load_error or ''}"
        )

    # Resolve user_id from form parameter, header, or default
    resolved_user_id = user_id or request.headers.get("x-user-id") or request.headers.get("X-User-Id") or "user_demo"

    # Read uploaded file bytes
    try:
        image_bytes = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to read uploaded file: {str(e)}"
        )

    # 1. Run Machine Learning Model Inference
    try:
        pred_res = model_service.predict_image(image_bytes)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing machine learning prediction: {str(e)}"
        )

    predicted_class = pred_res["predicted_class"]
    confidence_val = pred_res["confidence"]
    confidence_percent_str = f"{round(confidence_val * 100, 2)}%"
    top_preds_raw = pred_res["top_predictions"]

    # Format top predictions schema
    top_predictions = [
        TopPrediction(class_name=tp["class_name"], confidence=tp["confidence"])
        for tp in top_preds_raw
    ]

    # 2. Query Supabase Data Layer
    db_data = await fetch_disease_data(predicted_class)

    d_info = db_data.get("disease_info", {})
    disease_info_model = DiseaseInfo(
        description=d_info.get("description"),
        causes=d_info.get("causes"),
        symptoms=d_info.get("symptoms"),
        severity=d_info.get("severity")
    )

    ayurvedic_recs = [
        AyurvedicRecommendation(
            medicine_name=m.get("medicine_name", "Remedy"),
            description=m.get("description"),
            usage=m.get("usage"),
            precautions=m.get("precautions")
        )
        for m in db_data.get("ayurvedic_recommendations", [])
    ]

    diet_recs = [
        DietRecommendation(
            food=d.get("food", "Diet Item"),
            description=d.get("description"),
            recommendation_type=d.get("recommendation_type", "recommended")
        )
        for d in db_data.get("diet_recommendations", [])
    ]

    # Prepare primary remedy and diet text strings for UI convenience
    primary_ayurvedic_str = ", ".join([
        f"{rec.medicine_name}: {rec.description or ''}" for rec in ayurvedic_recs
    ]) if ayurvedic_recs else "Neem & Tulsi steam cleanse, followed by Kumkumadi oil application."

    primary_diet_str = ", ".join([
        f"{rec.food} ({rec.recommendation_type})" for rec in diet_recs
    ]) if diet_recs else "Incorporate Pitta-cooling diet: coconut water, cucumber, coriander tea. Avoid fried foods."

    skin_score = db_data.get("skin_score", 80)

    # 3. Save Scan Record into Supabase Storage & Database
    saved_scan = await save_scan_record_to_supabase(
        user_id=resolved_user_id,
        image_bytes=image_bytes,
        file_name=file.filename or "skin_scan.jpg",
        predicted_disease=predicted_class,
        confidence=confidence_val,
        skin_health_score=skin_score
    )

    return PredictResponse(
        success=True,
        prediction=PredictionDetail(
            disease=predicted_class,
            confidence=confidence_val
        ),
        top_predictions=top_predictions,
        disease_info=disease_info_model,
        ayurvedic_recommendations=ayurvedic_recs,
        diet_recommendations=diet_recs,
        # Convenience properties
        scan_id=saved_scan.get("id"),
        image_url=saved_scan.get("image_url"),
        predicted_disease=predicted_class,
        confidence=confidence_percent_str,
        symptoms=disease_info_model.symptoms or "Skin erythema, localized rash or lesion.",
        probable_cause=disease_info_model.causes or "Tridosha imbalance causing epidermal skin reaction.",
        ayurvedic_remedy=primary_ayurvedic_str,
        diet_recommendation=primary_diet_str,
        skin_type=db_data.get("skin_type", "Combination"),
        skin_score=skin_score,
        routine=db_data.get("routine", ["Neem Cleanser", "Aloe Vera Gel"])
    )

@app.get("/progress", response_model=ProgressResponse, summary="Get Initial & Latest User Scan Progress", tags=["Progress"])
async def get_progress(
    request: Request,
    user_id: Optional[str] = Query(None)
):
    """
    Retrieve user scan progress including:
    - Initial Scan (Earliest scan record for the user)
    - Latest Scan (Most recent scan record for the user)
    - Overall improvement statistics
    - Skin health score breakdown
    - Full scan history sorted newest -> oldest
    """
    resolved_user_id = user_id or request.headers.get("x-user-id") or request.headers.get("X-User-Id") or "user_demo"
    progress_data = await get_user_progress_data(resolved_user_id)
    return ProgressResponse(**progress_data)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)