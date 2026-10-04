# AyuDerma FastAPI Backend

Skin disease prediction & Ayurvedic analysis API powered by EfficientNetB0 (Keras/TensorFlow) and Supabase database integration.

## Project Structure
```
backend/
├── main.py                     # FastAPI application entry point
├── requirements.txt            # Python package dependencies
├── .env                        # Local environment variables (DO NOT COMMIT)
├── .env.example                # Environment template
├── README.md                   # Backend documentation
├── supabase_schema.sql         # SQL schema & seeds for Supabase database
│
├── model/
│   ├── final_skin_disease_model.keras  # Trained EfficientNetB0 model
│   └── class_names.json                # Class index to disease name mapping
│
├── services/
│   ├── model_service.py        # Single-load Keras model manager & inference service
│   └── supabase_service.py     # Supabase DB query client for disease, remedy & diet info
│
├── schemas/
│   └── response_models.py      # Pydantic schemas for API response & health checks
│
└── utils/
    └── image_processing.py     # Image validation & 224x224 RGB EfficientNet preprocessing
```

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your `SUPABASE_URL` and `SUPABASE_KEY` if available.

3. **Start FastAPI Development Server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Interactive Documentation**:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Core API Endpoints

- `GET /health`: Health check verifying model status and DB configuration.
- `POST /predict`: Upload image via `multipart/form-data` (`file`) to obtain predicted disease, model confidence, Ayurvedic remedies, and diet recommendations.
