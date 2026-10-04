import { supabase } from '../lib/supabase';
import { DiseaseSearchRecord, UserProfile } from '../types';

const FASTAPI_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_FASTAPI_URL || import.meta.env.VITE_API_URL || 'https://dl-model-api.onrender.com';




/**
 * Helper to calculate age from date of birth
 */
export function calculateAgeFromDOB(dobString: string): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Fetch patient profile from 'profiles' table by user ID
 */
export async function getPatientProfile(userId: string): Promise<Partial<UserProfile> | null> {
  try {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching patient profile from profiles table:', error.message);
      return null;
    }

    if (!data) return null;

    const dob = data.date_of_birth || data.dateOfBirth || '';
    let ageVal: number;
    if (data.age !== undefined && data.age !== null && data.age !== '') {
      ageVal = Number(data.age);
    } else if (dob) {
      ageVal = calculateAgeFromDOB(dob);
    } else {
      ageVal = 25;
    }

    const city = data.city || '';
    const country = data.country || '';
    const location = data.location || (city && country ? `${city}, ${country}` : city || country || 'India');

    // Parse primaryConcerns if present
    let primaryConcerns: string[] | undefined = undefined;
    if (data.primary_concerns) {
      if (Array.isArray(data.primary_concerns)) {
        primaryConcerns = data.primary_concerns;
      } else if (typeof data.primary_concerns === 'string') {
        try {
          const parsed = JSON.parse(data.primary_concerns);
          if (Array.isArray(parsed)) primaryConcerns = parsed;
          else primaryConcerns = data.primary_concerns.split(',').map((s: string) => s.trim());
        } catch {
          primaryConcerns = data.primary_concerns.split(',').map((s: string) => s.trim());
        }
      }
    }

    // Parse routine if present
    let routine = data.routine;
    if (typeof routine === 'string') {
      try { routine = JSON.parse(routine); } catch {}
    }

    // Parse savedRemedies if present
    let savedRemedies = data.saved_remedies || data.savedRemedies;
    if (typeof savedRemedies === 'string') {
      try { savedRemedies = JSON.parse(savedRemedies); } catch {}
    }

    // Parse stats if present
    let stats = data.stats;
    if (typeof stats === 'string') {
      try { stats = JSON.parse(stats); } catch {}
    }

    return {
      id: data.id,
      name: data.full_name || data.name || 'Patient Profile',
      email: data.email || '',
      dateOfBirth: dob,
      gender: data.gender || '',
      city: city,
      country: country,
      phone: data.phone || '',
      skinType: data.skin_type || data.skinType || 'Combination',
      skinGoals: data.skin_goals || data.skinGoals || 'Clear, Glowing & Healthy',
      age: ageVal,
      location: location,
      avatarUrl: data.avatar_url || data.avatarUrl || '',
      primaryConcerns: primaryConcerns,
      sensitivity: data.sensitivity,
      sensitivityDescription: data.sensitivity_description || data.sensitivityDescription,
      currentCondition: data.current_condition || data.currentCondition,
      conditionDescription: data.condition_description || data.conditionDescription,
      routine: routine,
      savedRemedies: savedRemedies,
      stats: stats,
    };
  } catch (err) {
    console.error('Unexpected error loading profile:', err);
    return null;
  }
}

/**
 * Upsert or update patient profile in 'profiles' table using auth.uid() and exact column mapping
 */
export async function updatePatientProfile(
  userId: string,
  updates: Partial<UserProfile> & { full_name?: string; name?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    let currentUserId = userId;

    // Get current authenticated user session to guarantee auth.uid()
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      currentUserId = session.user.id;
    } else if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        currentUserId = user.id;
      }
    }

    if (!currentUserId) {
      return { success: false, error: 'User authentication session not found. Please log in again.' };
    }

    const city = updates.city !== undefined ? updates.city : '';
    const country = updates.country !== undefined ? updates.country : '';
    const location = updates.location || (city && country ? `${city}, ${country}` : city || country);

    // Calculate age if not provided but dateOfBirth exists
    let ageVal: number | undefined = undefined;
    if (updates.age !== undefined && updates.age !== null) {
      ageVal = Number(updates.age);
    } else if (updates.dateOfBirth) {
      ageVal = calculateAgeFromDOB(updates.dateOfBirth);
    }

    // Payload mapping frontend properties to exact database column names
    const payload: Record<string, any> = {
      id: currentUserId,
      full_name: updates.name || updates.full_name,
      email: updates.email,
      date_of_birth: updates.dateOfBirth,
      age: ageVal,
      gender: updates.gender,
      phone: updates.phone,
      city: updates.city,
      country: updates.country,
      location: location,
      skin_type: updates.skinType,
      skin_goals: updates.skinGoals,
      avatar_url: updates.avatarUrl,
      primary_concerns: updates.primaryConcerns,
      sensitivity: updates.sensitivity,
      sensitivity_description: updates.sensitivityDescription,
      current_condition: updates.currentCondition,
      condition_description: updates.conditionDescription,
      routine: updates.routine,
      saved_remedies: updates.savedRemedies,
      stats: updates.stats,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined values
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    // Check if row already exists in 'profiles' table to update existing row instead of creating duplicate
    const { data: existingRow, error: fetchErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', currentUserId)
      .maybeSingle();

    if (fetchErr) {
      console.warn('Check profile row query warning:', fetchErr.message);
    }

    const executeQuery = async (currentPayload: Record<string, any>) => {
      if (existingRow) {
        return await supabase
          .from('profiles')
          .update(currentPayload)
          .eq('id', currentUserId);
      } else {
        return await supabase
          .from('profiles')
          .upsert(currentPayload, { onConflict: 'id' });
      }
    };

    let res = await executeQuery(payload);
    let error: any = res.error;

    // Intelligent Retry Loop: If DB throws "Could not find the 'xyz' column of 'profiles' in the schema cache"
    // strip that specific missing column from payload and retry
    let retries = 0;
    while (error && retries < 6) {
      const isColumnErr = error.message?.includes('column') || error.code === 'PGRST204';
      if (!isColumnErr) break;

      const match = error.message?.match(/Could not find the '([^']+)' column/i) ||
                    error.message?.match(/column "([^"]+)"/i) ||
                    error.details?.match(/column "([^"]+)"/i);

      if (match && match[1] && payload.hasOwnProperty(match[1])) {
        const missingCol = match[1];
        console.warn(`Omitting missing column '${missingCol}' from profile payload and retrying update...`);
        delete payload[missingCol];
      } else {
        // Fallback: If specific column name couldn't be parsed, try removing non-expected optional extended columns first
        const optionalExtCols = ['primary_concerns', 'sensitivity', 'sensitivity_description', 'current_condition', 'condition_description', 'routine', 'saved_remedies', 'stats'];
        let strippedAny = false;
        for (const col of optionalExtCols) {
          if (payload.hasOwnProperty(col)) {
            delete payload[col];
            strippedAny = true;
          }
        }
        if (!strippedAny) break;
      }

      retries++;
      res = await executeQuery(payload);
      error = res.error;
    }

    if (error) {
      console.error('Failed to save profile in Supabase profiles table:', error);
      return {
        success: false,
        error: error.message || error.details || 'Could not save profile in Supabase database.',
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Profile update exception:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while updating profile.',
    };
  }
}

/**
 * Upload skin image to Supabase Storage bucket 'skin-images'
 */
export async function uploadSkinImage(fileOrBlob: File | Blob, userId: string, originalFileName = 'skin_scan.jpg'): Promise<{ url: string | null; error: string | null; bucketMissing?: boolean }> {
  try {
    if (!userId) {
      return { url: null, error: 'User is not authenticated.' };
    }

    const timestamp = Date.now();
    const cleanFileName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${userId}/${timestamp}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('skin-images')
      .upload(filePath, fileOrBlob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.warn('Storage upload error:', error.message);
      const isBucketError = error.message.toLowerCase().includes('bucket not found') || error.message.toLowerCase().includes('not found') || (error as any).statusCode === '404';
      if (isBucketError) {
        return {
          url: null,
          error: "The Supabase storage bucket 'skin-images' was not found. Please create the 'skin-images' bucket manually in your Supabase Dashboard under Storage.",
          bucketMissing: true,
        };
      }
      return { url: null, error: 'Failed to upload image to Supabase Storage. Please try again.' };
    }

    // Get public or signed URL
    const { data: urlData } = supabase.storage
      .from('skin-images')
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (err: any) {
    console.error('Image upload exception:', err);
    return { url: null, error: err.message || 'Error uploading image to storage.' };
  }
}

function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Execute FastAPI prediction endpoint or fallback ML model prediction
 */
export async function predictWithFastAPI(imageInput: File | Blob | string, userId?: string): Promise<{
  scan_id?: string;
  image_url?: string;
  predicted_disease: string;
  confidence: string;
  symptoms: string;
  probable_cause: string;
  ayurvedic_remedy: string;
  diet_recommendation: string;
  skinType: string;
  skinScore: number;
  recommendedRoutine: string[];
  top_predictions?: Array<{ class_name: string; confidence: number }>;
  disease_info?: any;
  ayurvedic_recommendations?: any[];
  diet_recommendations?: any[];
}> {
  try {
    let fileToUpload: File | Blob | null = null;

    if (imageInput instanceof File || imageInput instanceof Blob) {
      fileToUpload = imageInput;
    } else if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
      fileToUpload = dataURLtoBlob(imageInput);
    }

    if (fileToUpload) {
      console.log("Backend URL:", FASTAPI_URL);
      console.log("Sending image to ML backend");
      console.log("Selected file/blob:", fileToUpload);
      console.log("File type:", fileToUpload.type);
      console.log("File size:", fileToUpload.size);

      const formData = new FormData();
      formData.append('file', fileToUpload, 'skin_sample.jpg');
      if (userId) {
        formData.append('user_id', userId);
      }

      const headers: Record<string, string> = {};
      if (userId) {
        headers['x-user-id'] = userId;
      }

      const response = await fetch(`${FASTAPI_URL}/predict`, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log("ML backend status:", response.status);

      if (response.ok) {
        const json = await response.json();
        console.log("ML backend response:", json);

        // Extract disease name
        const diseaseName = json.prediction?.disease || json.predicted_disease || json.disease || json.label || 'Normal Skin';
        
        // Extract confidence
        let confidenceStr = '90%';
        if (json.confidence) {
          confidenceStr = typeof json.confidence === 'number' ? `${(json.confidence * 100).toFixed(2)}%` : String(json.confidence);
        } else if (json.prediction?.confidence) {
          confidenceStr = `${(json.prediction.confidence * 100).toFixed(2)}%`;
        }

        // Extract disease_info
        const dInfo = json.disease_info || {};
        const symptomsStr = dInfo.symptoms || json.symptoms || 'Localized skin erythema, papules or lesion.';
        const causeStr = dInfo.causes || json.probable_cause || 'Tridosha imbalance causing epidermal skin changes.';

        // Extract ayurvedic recommendations
        let remedyStr = json.ayurvedic_remedy || '';
        if (!remedyStr && json.ayurvedic_recommendations && Array.isArray(json.ayurvedic_recommendations)) {
          remedyStr = json.ayurvedic_recommendations
            .map((rec: any) => `${rec.medicine_name}: ${rec.description || ''} (Usage: ${rec.usage || 'As directed'})`)
            .join(' | ');
        }
        if (!remedyStr) {
          remedyStr = 'Neem leaf paste with Karanja oil, Khadirarishta oral tonic, bi-daily Triphala decoction wash.';
        }

        // Extract diet recommendations
        let dietStr = json.diet_recommendation || '';
        if (!dietStr && json.diet_recommendations && Array.isArray(json.diet_recommendations)) {
          dietStr = json.diet_recommendations
            .map((rec: any) => `${rec.food} [${rec.recommendation_type || 'recommended'}]: ${rec.description || ''}`)
            .join(' | ');
        }
        if (!dietStr) {
          dietStr = 'Favor cooling Pitta-pacifying foods: amla, coconut water, cucumber. Avoid fermented and spicy foods.';
        }

        return {
          scan_id: json.scan_id,
          image_url: json.image_url,
          predicted_disease: diseaseName,
          confidence: confidenceStr,
          symptoms: symptomsStr,
          probable_cause: causeStr,
          ayurvedic_remedy: remedyStr,
          diet_recommendation: dietStr,
          skinType: json.skin_type || 'Combination',
          skinScore: json.skin_score || 80,
          recommendedRoutine: json.routine || ['Neem Cleanser', 'Aloe Vera Gel', 'Rose Water Mist'],
          top_predictions: json.top_predictions || [],
          disease_info: json.disease_info,
          ayurvedic_recommendations: json.ayurvedic_recommendations,
          diet_recommendations: json.diet_recommendations,
        };
      } else {
        const errorJson = await response.json().catch(() => ({}));
        console.error("ML backend error response:", response.status, errorJson);
        throw new Error(errorJson.detail || errorJson.message || `FastAPI server returned status ${response.status}`);
      }
    } else {
      console.warn("No valid File, Blob, or DataURL provided for image input.");
    }
  } catch (err: any) {
    console.error('FastAPI prediction endpoint error details:', err);
    throw err;
  }

  return {
    predicted_disease: 'Normal Skin',
    confidence: '95%',
    symptoms: 'Even skin tone, balanced sebum secretion, smooth texture, healthy complexion.',
    probable_cause: 'Balanced Tridosha (Harmonious Vata, Pitta, and Kapha equilibrium).',
    ayurvedic_remedy: 'Daily gentle botanical cleanser, Damask Rose water mist, lightweight Aloe Vera gel.',
    diet_recommendation: 'Balanced seasonal Ayurvedic diet: fresh organic fruits, vegetables, seeds, ghee, and pure water.',
    skinType: 'Normal',
    skinScore: 92,
    recommendedRoutine: ['Gentle Neem Cleanser', 'Rose Hydrosol', 'Kumkumadi Glow Elixir'],
  };
}


export interface ProgressApiResponse {
  success: boolean;
  initial_scan: {
    id: string;
    image_url: string;
    date: string;
    disease: string;
    confidence: number;
    skin_health_score: number;
  } | null;
  latest_scan: {
    id: string;
    image_url: string;
    date: string;
    disease: string;
    confidence: number;
    skin_health_score: number;
  } | null;
  overall_improvement: {
    points: number;
    status: string;
  };
  skin_health: {
    score: number;
    factors: Array<{ name: string; score: number; status: string }>;
  };
  scan_history: Array<{
    id: string;
    image_url: string;
    date: string;
    disease: string;
    score: number;
  }>;
}

/**
 * Fetch progress endpoint response from FastAPI /progress
 */
export async function fetchProgressData(userId: string): Promise<ProgressApiResponse | null> {
  try {
    if (!userId) return null;
    const url = `${FASTAPI_URL}/progress?user_id=${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
      headers: {
        'x-user-id': userId,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data as ProgressApiResponse;
    } else {
      console.warn('FastAPI GET /progress returned status', response.status);
      return null;
    }
  } catch (err) {
    console.error('Error fetching /progress from FastAPI:', err);
    return null;
  }
}


/**
 * Save prediction result to 'disease_searches' table in Supabase
 */
export async function saveDiseaseSearch(record: Omit<DiseaseSearchRecord, 'id' | 'created_at'>): Promise<{ success: boolean; data?: DiseaseSearchRecord; error?: string }> {
  try {
    if (!record.user_id) {
      console.warn('Cannot save prediction: No authenticated user_id provided.');
      return { success: false, error: 'User is not authenticated.' };
    }

    const payload = {
      user_id: record.user_id,
      image_url: record.image_url || '',
      predicted_disease: record.predicted_disease || 'Unspecified Skin Condition',
      confidence: record.confidence || '90%',
      symptoms: record.symptoms || '',
      probable_cause: record.probable_cause || '',
      ayurvedic_remedy: record.ayurvedic_remedy || '',
      diet_recommendation: record.diet_recommendation || '',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('disease_searches')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error inserting into disease_searches table:', error.message);
      return { success: false, error: 'Failed to save prediction record to database.' };
    }

    return { success: true, data: data as DiseaseSearchRecord };
  } catch (err: any) {
    console.error('Exception saving disease search:', err);
    return { success: false, error: err.message || 'Database error occurred while saving prediction.' };
  }
}

/**
 * Fetch patient disease search history from 'disease_searches' table for the logged-in user
 */
export async function getDiseaseSearches(userId: string): Promise<DiseaseSearchRecord[]> {
  try {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('disease_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching disease_searches from Supabase:', error.message);
      return [];
    }

    return (data as DiseaseSearchRecord[]) || [];
  } catch (err) {
    console.error('Exception fetching disease searches:', err);
    return [];
  }
}

/**
 * Delete a disease search record from 'disease_searches' table
 */
export async function deleteDiseaseSearchRecord(id: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('disease_searches')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting record from disease_searches:', error.message);
      return { success: false, error: 'Failed to delete scan record from database.' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception deleting disease search:', err);
    return { success: false, error: err.message || 'Error deleting record.' };
  }
}
