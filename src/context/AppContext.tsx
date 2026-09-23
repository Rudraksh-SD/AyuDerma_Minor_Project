import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageType, UserProfile, SkinScan, SavedRemedy, ProgressDataPoint } from '../types';
import { INITIAL_USER, INITIAL_SCANS, WEEKLY_PROGRESS_DATA, MONTHLY_PROGRESS_DATA } from '../data/initialData';

interface AppContextType {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  user: UserProfile;
  login: (email?: string, password?: string) => void;
  logout: () => void;
  scans: SkinScan[];
  addScan: (newScanData: Partial<SkinScan>) => SkinScan;
  selectedScan: SkinScan | null;
  setSelectedScan: (scan: SkinScan | null) => void;
  weeklyProgress: ProgressDataPoint[];
  monthlyProgress: ProgressDataPoint[];
  updateProfile: (updates: Partial<UserProfile>) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<PageType>('home');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ayuderma_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USER;
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

  // Sync to localStorage
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
    }, 3500);
  };

  const setActivePage = (page: PageType) => {
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email?: string) => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: true,
      email: email || prev.email,
    }));
    showToast(`Welcome back, ${user.name.split(' ')[0]}! Logged in successfully.`);
    setActivePage('home');
  };

  const logout = () => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: false,
    }));
    showToast('Logged out successfully. See you soon!', 'info');
    setActivePage('login');
  };

  const addScan = (newScanData: Partial<SkinScan>): SkinScan => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newScan: SkinScan = {
      id: `scan-${Date.now()}`,
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
      confidence: newScanData.confidence ?? '92%',
      accuracy: newScanData.accuracy ?? 'High Accuracy',
      recommendedRoutine: newScanData.recommendedRoutine ?? ['Neem Face Wash', 'Aloe Vera Gel', 'Tulsi & Manjistha Oil'],
      thumbnailUrl: newScanData.thumbnailUrl ?? scans[0]?.thumbnailUrl,
      factors: newScanData.factors ?? {
        hydration: { score: 86, label: 'Excellent' },
        acne: { score: 74, label: 'Good' },
        texture: { score: 82, label: 'Good' },
        pigmentation: { score: 68, label: 'Fair' },
        glow: { score: 92, label: 'Excellent' },
      },
    };

    setScans(prev => [newScan, ...prev]);

    // Update user stats
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        scansCompleted: prev.stats.scansCompleted + 1,
        overallProgress: Math.min(98, prev.stats.overallProgress + 1),
      },
    }));

    // Update progress data
    setWeeklyProgress(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      if (lastIndex >= 0) {
        updated[lastIndex] = { ...updated[lastIndex], score: newScan.skinScore };
      }
      return updated;
    });

    showToast('New skin scan analyzed and recorded in your history!');
    return newScan;
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
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
        logout,
        scans,
        addScan,
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
