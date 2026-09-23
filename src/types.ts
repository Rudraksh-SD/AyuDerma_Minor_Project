export type PageType = 'home' | 'scan' | 'progress' | 'history' | 'profile' | 'login';

export interface UserProfile {
  name: string;
  email: string;
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
}

export interface ProgressDataPoint {
  period: string;
  score: number;
}
