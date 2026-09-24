import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageType, UserProfile, SkinScan, SavedRemedy, ProgressDataPoint, DiseaseSearchRecord } from '../types';
import { INITIAL_USER, INITIAL_SCANS, WEEKLY_PROGRESS_DATA, MONTHLY_PROGRESS_DATA } from '../data/initialData';
import { supabase } from '../lib/supabase';
import { getPatientProfile, updatePatientProfile, getDiseaseSearches, deleteDiseaseSearchRecord, saveDiseaseSearch } from '../services/supabaseService';

interface AppContextType {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  user: UserProfile;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  scans: SkinScan[];
  addScan: (newScanData: Partial<SkinScan>) => Promise<SkinScan>;
  deleteScan: (id: string) => Promise<void>;
  selectedScan: SkinScan | null;
  setSelectedScan: (scan: SkinScan | null) => void;
  weeklyProgress: ProgressDataPoint[];
  monthlyProgress: ProgressDataPoint[];
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateRoutine: (routine: UserProfile['routine']) => void;
  addSavedRemedy: (remedy: SavedRemedy) => void;
  removeSavedRemedy: (id: string) => void;
  showRecommendationsModal: boolean;
  setShowRecommendationsModal: (show: boolean) => void;
  showEditProfileModal: boolean;
  setShowEditProfileModal: (show: boolean) => void;
  showAddRemedyModal: boolean;
  setShowAddRemedyModal: (show: boolean) => void;
  toast: { message: string; type: 'success' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'info') => void;
  authLoading: boolean;
  historyLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<PageType>('home');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ayuderma_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return { ...INITIAL_USER, isLoggedIn: false };
  });

  const [scans, setScans] = useState<SkinScan[]>(() => {
    const saved = localStorage.getItem('ayuderma_scans');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SCANS;
  });

  const [weeklyProgress, setWeeklyProgress] = useState<ProgressDataPoint[]>(WEEKLY_PROGRESS_DATA);
  const [monthlyProgress, setMonthlyProgress] = useState<ProgressDataPoint[]>(MONTHLY_PROGRESS_DATA);
  const [selectedScan, setSelectedScan] = useState<SkinScan | null>(null);

  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddRemedyModal, setShowAddRemedyModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync state to local cache
  useEffect(() => {
    try {
      localStorage.setItem('ayuderma_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('ayuderma_scans', JSON.stringify(scans));
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }, [scans]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Route Protection: Unauthenticated user -> redirect to login for protected pages
  const setActivePage = (page: PageType) => {
    const protectedPages: PageType[] = ['scan', 'progress', 'history', 'profile'];
    if (!user.isLoggedIn && protectedPages.includes(page)) {
      showToast('Please sign in to access your skin dashboard and records.', 'info');
      setActivePageState('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch Supabase Disease Searches and convert to SkinScan format
  const loadUserHistory = async (userId: string) => {
    setHistoryLoading(true);
    try {
      const records = await getDiseaseSearches(userId);
      if (records && records.length > 0) {
        const dbScans: SkinScan[] = records.map((rec: DiseaseSearchRecord) => {
          const dateObj = new Date(rec.created_at || Date.now());
          const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
          const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          return {
            id: rec.id,
            user_id: rec.user_id,
            date: formattedDate,
            time: formattedTime,
            timestamp: dateObj.getTime(),
            skinScore: 84,
            scoreLabel: 'Good',
            skinType: 'Combination',
            primaryConcern: rec.predicted_disease || 'Skin Analysis',
            concerns: rec.symptoms ? rec.symptoms.split(', ') : [rec.predicted_disease],
            severity: 'Mild',
            severityLevel: 'Level: Low to Moderate',
            confidence: typeof rec.confidence === 'number' ? `${rec.confidence}%` : rec.confidence || '90%',
            accuracy: 'High Accuracy',
            recommendedRoutine: rec.ayurvedic_remedy ? [rec.ayurvedic_remedy] : ['Neem Face Wash', 'Aloe Vera Gel'],
            thumbnailUrl: rec.image_url,
            symptoms: rec.symptoms,
            probable_cause: rec.probable_cause,
            ayurvedic_remedy: rec.ayurvedic_remedy,
            diet_recommendation: rec.diet_recommendation,
            created_at: rec.created_at,
            factors: {
              hydration: { score: 85, label: 'Excellent' },
              acne: { score: 74, label: 'Good' },
              texture: { score: 80, label: 'Good' },
              pigmentation: { score: 68, label: 'Fair' },
              glow: { score: 90, label: 'Excellent' },
            },
          };
        });

        setScans(dbScans);
      }
    } catch (err) {
      console.error('Failed to load user history from Supabase:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Synchronize authenticated user & load profile from Supabase
  const syncSupabaseSession = async (sessionUser: any) => {
    if (!sessionUser) {
      setUser(prev => ({ ...prev, isLoggedIn: false, id: undefined }));
      return;
    }

    const userId = sessionUser.id;
    const userEmail = sessionUser.email || '';
    const fullName = sessionUser.user_metadata?.full_name || userEmail.split('@')[0] || 'Patient';

    // Fetch existing profile from 'profiles' table
    const profile = await getPatientProfile(userId);

    setUser(prev => ({
      ...prev,
      id: userId,
      isLoggedIn: true,
      name: profile?.name || fullName,
      email: profile?.email || userEmail,
      dateOfBirth: profile?.dateOfBirth || prev.dateOfBirth || '',
      gender: profile?.gender || prev.gender || '',
      phone: profile?.phone || prev.phone || '',
      skinType: profile?.skinType || prev.skinType,
      skinGoals: profile?.skinGoals || prev.skinGoals,
      age: profile?.age || prev.age,
      location: profile?.location || prev.location,
    }));

    // If no existing profile row in Supabase, create default
    if (!profile) {
      await updatePatientProfile(userId, {
        name: fullName,
        email: userEmail,
        skinType: INITIAL_USER.skinType,
        skinGoals: INITIAL_USER.skinGoals,
        age: INITIAL_USER.age,
        location: INITIAL_USER.location,
      });
    }

    // Load disease history records from Supabase
    await loadUserHistory(userId);
  };

  // Auth State Listener & Initial Session Check
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          await syncSupabaseSession(session.user);
        } else if (mounted) {
          setUser(prev => ({ ...prev, isLoggedIn: false }));
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          await syncSupabaseSession(session.user);
        } else {
          setUser(prev => ({ ...prev, isLoggedIn: false, id: undefined }));
        }
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Supabase Auth Sign In
  const login = async (email: string, password?: string): Promise<{ success: boolean; isProfileComplete?: boolean; error?: string }> => {
    try {
      if (!password) {
        // Fallback for simple demo login
        setUser(prev => ({ ...prev, isLoggedIn: true, email }));
        const isComplete = Boolean(user.dateOfBirth && user.gender);
        if (isComplete) {
          showToast(`Welcome back, ${email.split('@')[0]}! Logged in successfully.`);
          setActivePage('home');
        }
        return { success: true, isProfileComplete: isComplete };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const friendlyMsg = error.message.includes('Invalid login credentials')
          ? 'Invalid email or password. Please verify your credentials.'
          : error.message;
        showToast(friendlyMsg, 'info');
        return { success: false, error: friendlyMsg };
      }

      if (data.user) {
        await syncSupabaseSession(data.user);
        const profile = await getPatientProfile(data.user.id);
        const isComplete = Boolean(profile?.dateOfBirth && profile?.gender);
        const namePart = profile?.name || data.user.user_metadata?.full_name || email.split('@')[0];

        if (isComplete) {
          showToast(`Welcome back, ${namePart}! Logged in successfully.`);
          setActivePage('home');
        } else {
          showToast(`Welcome back, ${namePart}! Please complete your personal details to continue.`, 'info');
        }

        return { success: true, isProfileComplete: isComplete };
      }

      return { success: false, error: 'Authentication failed.' };
    } catch (err: any) {
      const msg = err.message || 'An unexpected login error occurred.';
      showToast(msg, 'info');
      return { success: false, error: msg };
    }
  };

  // Supabase Auth Sign Up
  const signUp = async (name: string, email: string, password?: string): Promise<{ success: boolean; isProfileComplete?: boolean; error?: string }> => {
    try {
      if (!password) {
        setUser(prev => ({ ...prev, isLoggedIn: true, name, email }));
        showToast(`Account created for ${name}! Please complete your personal details.`);
        return { success: true, isProfileComplete: false };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        const friendlyMsg = error.message.includes('User already registered')
          ? 'An account with this email already exists. Please sign in.'
          : error.message;
        showToast(friendlyMsg, 'info');
        return { success: false, error: friendlyMsg };
      }

      if (data.user) {
        await syncSupabaseSession(data.user);
        // Create initial profile row
        await updatePatientProfile(data.user.id, {
          name,
          email,
          skinType: INITIAL_USER.skinType,
          skinGoals: INITIAL_USER.skinGoals,
          age: INITIAL_USER.age,
          location: INITIAL_USER.location,
        });

        showToast(`Account created for ${name}! Please enter your personal details.`);
        return { success: true, isProfileComplete: false };
      }

      return { success: false, error: 'Sign up failed.' };
    } catch (err: any) {
      const msg = err.message || 'An unexpected sign up error occurred.';
      showToast(msg, 'info');
      return { success: false, error: msg };
    }
  };

  // Supabase Auth Sign Out
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setUser(prev => ({
      ...prev,
      isLoggedIn: false,
      id: undefined,
    }));
    showToast('Logged out successfully. See you soon!', 'info');
    setActivePageState('login');
  };

  // Add Skin Scan (and save to Supabase disease_searches table if logged in)
  const addScan = async (newScanData: Partial<SkinScan>): Promise<SkinScan> => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let savedId = `scan-${Date.now()}`;

    // If user is logged in, save to Supabase 'disease_searches' table
    if (user.isLoggedIn && user.id) {
      const saveRes = await saveDiseaseSearch({
        user_id: user.id,
        image_url: newScanData.thumbnailUrl || '',
        predicted_disease: newScanData.primaryConcern || 'Mild Acne',
        confidence: newScanData.confidence || '94%',
        symptoms: newScanData.symptoms || (newScanData.concerns ? newScanData.concerns.join(', ') : 'Mild erythema, enlarged pores'),
        probable_cause: newScanData.probable_cause || 'Pitta-Kapha dosha imbalance causing glandular sebum blockage.',
        ayurvedic_remedy: newScanData.ayurvedic_remedy || (newScanData.recommendedRoutine ? newScanData.recommendedRoutine.join(', ') : 'Neem & Tulsi Wash'),
        diet_recommendation: newScanData.diet_recommendation || 'Pitta pacifying diet: cooling fruits, greens, moong dal.',
      });

      if (saveRes.success && saveRes.data?.id) {
        savedId = saveRes.data.id;
      }
    }

    const newScan: SkinScan = {
      id: savedId,
      user_id: user.id,
      date: formattedDate,
      time: formattedTime,
      timestamp: now.getTime(),
      skinScore: newScanData.skinScore ?? 84,
      scoreLabel: (newScanData.skinScore ?? 84) >= 80 ? 'Good' : (newScanData.skinScore ?? 84) >= 65 ? 'Fair' : 'Needs Care',
      skinType: newScanData.skinType ?? user.skinType,
      skinTypeDescription: newScanData.skinTypeDescription ?? 'Balanced complexion with active cellular glow.',
      primaryConcern: newScanData.primaryConcern ?? 'Mild Acne',
      concerns: newScanData.concerns ?? ['Mild Acne', 'Open Pores'],
      severity: newScanData.severity ?? 'Mild',
      severityLevel: newScanData.severityLevel ?? 'Level: Low to Moderate',
      confidence: newScanData.confidence ?? '94%',
      accuracy: newScanData.accuracy ?? 'High Accuracy',
      recommendedRoutine: newScanData.recommendedRoutine ?? ['Neem Face Wash', 'Aloe Vera Gel', 'Tulsi & Manjistha Oil'],
      thumbnailUrl: newScanData.thumbnailUrl ?? scans[0]?.thumbnailUrl,
      symptoms: newScanData.symptoms,
      probable_cause: newScanData.probable_cause,
      ayurvedic_remedy: newScanData.ayurvedic_remedy,
      diet_recommendation: newScanData.diet_recommendation,
      factors: newScanData.factors ?? {
        hydration: { score: 86, label: 'Excellent' },
        acne: { score: 74, label: 'Good' },
        texture: { score: 82, label: 'Good' },
        pigmentation: { score: 68, label: 'Fair' },
        glow: { score: 92, label: 'Excellent' },
      },
    };

    setScans(prev => [newScan, ...prev.filter(s => s.id !== newScan.id)]);

    // Update user stats
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        scansCompleted: prev.stats.scansCompleted + 1,
        overallProgress: Math.min(98, prev.stats.overallProgress + 1),
      },
    }));

    showToast('New skin scan analyzed and recorded in your history!');
    return newScan;
  };

  // Delete scan from state & Supabase
  const deleteScan = async (id: string) => {
    if (user.isLoggedIn && user.id) {
      await deleteDiseaseSearchRecord(id, user.id);
    }
    setScans(prev => prev.filter(s => s.id !== id));
    showToast('Scan history record deleted.', 'info');
  };

  // Update profile state & Supabase 'profiles' table
  const updateProfile = async (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));

    if (user.isLoggedIn && user.id) {
      const res = await updatePatientProfile(user.id, updates);
      if (!res.success) {
        showToast(res.error || 'Failed to update profile in database.', 'info');
        return;
      }
    }
    showToast('Profile updated successfully!');
  };

  const updateRoutine = (routine: UserProfile['routine']) => {
    setUser(prev => ({ ...prev, routine }));
    showToast('Ayurvedic skincare routine updated!');
  };

  const addSavedRemedy = (remedy: SavedRemedy) => {
    setUser(prev => ({
      ...prev,
      savedRemedies: [...prev.savedRemedies, remedy],
    }));
    showToast(`Saved "${remedy.title}" to your remedies!`);
  };

  const removeSavedRemedy = (id: string) => {
    setUser(prev => ({
      ...prev,
      savedRemedies: prev.savedRemedies.filter(r => r.id !== id),
    }));
    showToast('Remedy removed from saved list.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        user,
        login,
        signUp,
        logout,
        scans,
        addScan,
        deleteScan,
        selectedScan,
        setSelectedScan,
        weeklyProgress,
        monthlyProgress,
        updateProfile,
        updateRoutine,
        addSavedRemedy,
        removeSavedRemedy,
        showRecommendationsModal,
        setShowRecommendationsModal,
        showEditProfileModal,
        setShowEditProfileModal,
        showAddRemedyModal,
        setShowAddRemedyModal,
        toast,
        showToast,
        authLoading,
        historyLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
