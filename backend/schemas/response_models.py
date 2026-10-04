from typing import List, Optional
from pydantic import BaseModel, Field

class PredictionDetail(BaseModel):
    disease: str = Field(..., description="Name of the predicted skin disease or condition")
    confidence: float = Field(..., description="Confidence score between 0.0 and 1.0")

class TopPrediction(BaseModel):
    class_name: str = Field(..., description="Name of the candidate disease class")
    confidence: float = Field(..., description="Confidence percentage or float score")

class DiseaseInfo(BaseModel):
    description: Optional[str] = Field(None, description="Detailed overview of the disease")
    causes: Optional[str] = Field(None, description="Root causes according to medicine/Ayurveda")
    symptoms: Optional[str] = Field(None, description="Key observable clinical symptoms")
    severity: Optional[str] = Field(None, description="Severity rating (e.g. Low, Moderate, High)")

class AyurvedicRecommendation(BaseModel):
    medicine_name: str = Field(..., description="Name of the Ayurvedic medicine or remedy")
    description: Optional[str] = Field(None, description="Benefits and action mechanism")
    usage: Optional[str] = Field(None, description="Dosage and application instructions")
    precautions: Optional[str] = Field(None, description="Precautions or contraindications")

class DietRecommendation(BaseModel):
    food: str = Field(..., description="Recommended or restricted food item")
    description: Optional[str] = Field(None, description="Dietary purpose and health impact")
    recommendation_type: Optional[str] = Field("recommended", description="Type of recommendation: recommended or avoid")

class PredictResponse(BaseModel):
    success: bool = True
    prediction: PredictionDetail
    top_predictions: List[TopPrediction] = []
    disease_info: Optional[DiseaseInfo] = None
    ayurvedic_recommendations: List[AyurvedicRecommendation] = []
    diet_recommendations: List[DietRecommendation] = []

    # Convenience fields for seamless frontend compatibility
    scan_id: Optional[str] = None
    image_url: Optional[str] = None
    predicted_disease: str
    confidence: str
    symptoms: Optional[str] = None
    probable_cause: Optional[str] = None
    ayurvedic_remedy: Optional[str] = None
    diet_recommendation: Optional[str] = None
    skin_type: Optional[str] = "Combination"
    skin_score: Optional[int] = 80
    routine: Optional[List[str]] = []

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    database_configured: bool
    model_path: Optional[str] = None
    loaded_classes_count: int = 0

class ScanDetail(BaseModel):
    id: str
    image_url: str
    date: str
    disease: str
    confidence: float
    skin_health_score: int

class OverallImprovement(BaseModel):
    points: int
    status: str

class SkinFactor(BaseModel):
    name: str
    score: int
    status: str

class SkinHealthDetail(BaseModel):
    score: int
    factors: List[SkinFactor] = []

class ProgressHistoryItem(BaseModel):
    id: str
    image_url: str
    date: str
    disease: str
    score: int

class ProgressResponse(BaseModel):
    success: bool = True
    initial_scan: Optional[ScanDetail] = None
    latest_scan: Optional[ScanDetail] = None
    overall_improvement: OverallImprovement
    skin_health: SkinHealthDetail
    scan_history: List[ProgressHistoryItem] = []

