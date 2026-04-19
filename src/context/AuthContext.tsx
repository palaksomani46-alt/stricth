import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  hasQuotaError: boolean;
  isSafeMode: boolean;
  setSafeMode: (val: boolean) => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  hasQuotaError: false,
  isSafeMode: false,
  setSafeMode: () => {},
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('user_profile_cache');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [hasQuotaError, setHasQuotaError] = useState(false);
  const [isSafeMode, setSafeMode] = useState(() => localStorage.getItem('stitch_safe_mode') === 'true');

  useEffect(() => {
    localStorage.setItem('stitch_safe_mode', isSafeMode.toString());
  }, [isSafeMode]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        
        try {
          // Initial fetch
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfile(data);
            localStorage.setItem('user_profile_cache', JSON.stringify(data));
          } else {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              role: 'student',
              enrolledCourses: [],
              createdAt: new Date().toISOString(),
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
            localStorage.setItem('user_profile_cache', JSON.stringify(newProfile));
          }
          setHasQuotaError(false);
        } catch (error: any) {
          if (error.code === 'resource-exhausted') {
            console.error("AuthContext: Quota exhausted");
            setHasQuotaError(true);
          }
        }
      } else {
        setProfile(null);
        localStorage.removeItem('user_profile_cache');
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
    } catch (e: any) {
      if (e.code === 'resource-exhausted') {
        throw new Error("QUOTA_EXCEEDED");
      }
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      // Update local state immediately to avoid another read
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (e: any) {
      if (e.code === 'resource-exhausted') {
        throw new Error("QUOTA_EXCEEDED");
      }
      throw e;
    }
  };

  const isAdmin = React.useMemo(() => 
    profile?.role === 'admin' || user?.email === 'palaksomani46@gmail.com',
    [profile?.role, user?.email]
  );

  const value = React.useMemo(() => ({
    user,
    profile,
    loading,
    isAdmin,
    hasQuotaError,
    isSafeMode,
    setSafeMode,
    updateProfile,
    refreshProfile,
  }), [user, profile, loading, isAdmin, hasQuotaError, isSafeMode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
