
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and Monitor Auth State
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      alert("Firebase Config is missing in 'services/firebase.ts'.");
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login Failed", error);
      
      const currentDomain = window.location.hostname;
      
      if (error.code === 'auth/unauthorized-domain') {
          alert(`⚠️ Domain Authorization Required\n\nYour app is running on: ${currentDomain}\n\nSteps to fix:\n1. Open Firebase Console\n2. Go to Authentication -> Settings -> Authorized Domains\n3. Click 'Add Domain'\n4. Enter: ${currentDomain}\n5. Save and try again.`);
      } else if (error.code === 'auth/api-key-not-valid') {
          alert(`⚠️ Invalid API Key\n\nThe API Key in 'services/firebase.ts' is incorrect. Please double check your Firebase Project Settings.`);
      } else if (error.code === 'auth/popup-closed-by-user') {
          console.log("User closed login popup");
      } else {
          alert("Login Failed: " + (error.message || "Unknown error"));
      }
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
