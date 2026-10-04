export interface SkinPredictionResponse {
  success?: boolean;
  disease?: string;
  confidence?: number | string;
  predicted_disease?: string;
  symptoms?: string;
  probable_cause?: string;
  ayurvedic_remedy?: string;
  diet_recommendation?: string;
  top_predictions?: Array<{ class_name: string; confidence: number }>;
  disease_info?: {
    description?: string;
    causes?: string;
    symptoms?: string;
    severity?: string;
  };
  ayurvedic_recommendations?: Array<{
    medicine_name?: string;
    description?: string;
    usage?: string;
    precautions?: string;
  }>;
  diet_recommendations?: Array<{
    food?: string;
    description?: string;
    recommendation_type?: string;
  }>;
  [key: string]: unknown;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_FASTAPI_URL || import.meta.env.VITE_API_URL || 'https://dl-model-api.onrender.com';

/**
 * Send skin image to FastAPI TensorFlow backend for analysis.
 */
export async function analyzeSkinImage(file: File, userId?: string): Promise<SkinPredictionResponse> {
  if (!file) {
    throw new Error('Please upload a valid skin image file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  if (userId) {
    formData.append('user_id', userId);
  }

  const headers: Record<string, string> = {};
  if (userId) {
    headers['x-user-id'] = userId;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch (netErr: any) {
    throw new Error('Skin analysis service is currently unavailable. Please try again.');
  }

  if (!response.ok) {
    let errorDetail = 'Skin analysis request failed.';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = `Server returned status ${response.status}.`;
    }
    throw new Error(errorDetail);
  }

  let data: SkinPredictionResponse;
  try {
    data = await response.json();
  } catch {
    throw new Error('Failed to parse analysis response from server.');
  }

  return data;
}
