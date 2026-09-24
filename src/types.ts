export type PageType = 'home' | 'scan' | 'progress' | 'history' | 'profile' | 'login';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  city?: string;
  country?: string;
  isLoggedIn: boolean;
  avatarUrl: string;
  skinType: string;
  skinGoals: string;
  age: number;
  location: string;
  memberSince: string;
  primaryConcerns: string[];
  sensitivity: string;
  sensitivityDescription: string;
  currentCondition: string;
  conditionDescription: string;
  routine: {
    cleanse: string;
    tone: string;
    treat: string;
    moisturize: string;
    nourish: string;
  };
  savedRemedies: SavedRemedy[];
  stats: {
    scansCompleted: number;
    weeksConsistent: number;
    improvementScore: number;
    overallProgress: number;
  };
}

export interface SavedRemedy {
  id: string;
  title: string;
  category: string;
  benefit: string;
  imageUrl: string;
  description?: string;
  ingredients?: string[];
}

export interface SkinScan {
  id: string;
  user_id?: string;
  date: string;
  time: string;
  timestamp: number;
  skinScore: number;
  scoreLabel: string;
  skinType: string;
  skinTypeDescription?: string;
  primaryConcern: string;
  concerns: string[];
  severity: string;
  severityLevel: string;
  confidence: string;
  accuracy: string;
  recommendedRoutine: string[];
  thumbnailUrl: string;
  factors: {
    hydration: { score: number; label: string };
    acne: { score: number; label: string };
    texture: { score: number; label: string };
    pigmentation: { score: number; label: string };
    glow: { score: number; label: string };
  };
  // Supabase disease_searches fields
  symptoms?: string;
  probable_cause?: string;
  ayurvedic_remedy?: string;
  diet_recommendation?: string;
  created_at?: string;
}

export interface DiseaseSearchRecord {
  id: string;
  user_id: string;
  image_url: string;
  predicted_disease: string;
  confidence: string | number;
  symptoms: string;
  probable_cause: string;
  ayurvedic_remedy: string;
  diet_recommendation: string;
  created_at: string;
}

export interface ProgressDataPoint {
  period: string;
  score: number;
}
