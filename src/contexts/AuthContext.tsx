'use client'; // This context provider needs to be a client component

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  planType: 'free_trial' | 'standard' | 'expired' | null; // NEW: To track the user's plan
  trialEndDate: string | null; // NEW: To store the end date of the trial
  login: (token: string, userEmail: string, planType: AuthContextType['planType'], trialEndDate: string | null) => void; // MODIFIED: Added plan details
  logout: () => void;
  updatePlan: (planType: AuthContextType['planType'], trialEndDate: string | null) => void; // NEW: For upgrading plan
  isLoadingAuth: boolean; // To indicate if auth status is being checked
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [planType, setPlanType] = useState<AuthContextType['planType']>(null); // NEW
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null); // NEW
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On component mount, check localStorage for token and plan details
    const token = localStorage.getItem('token');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedPlanType = localStorage.getItem('planType') as AuthContextType['planType'];
    const storedTrialEndDate = localStorage.getItem('trialEndDate');

    if (token && storedUserEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedUserEmail);

      if (storedPlanType) {
        setPlanType(storedPlanType);
        setTrialEndDate(storedTrialEndDate);

        // Client-side expiry check for display/logic
        if (storedPlanType === 'free_trial' && storedTrialEndDate) {
          const today = new Date();
          const endDate = new Date(storedTrialEndDate);
          if (today > endDate) {
            setPlanType('expired');
          }
        }
      }
    }
    setIsLoadingAuth(false);
  }, []);

  // MODIFIED: Added planType and trialEndDate parameters
  const login = (token: string, email: string, planType: AuthContextType['planType'], trialEndDate: string | null) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('planType', planType || ''); // Store plan type
    localStorage.setItem('trialEndDate', trialEndDate || ''); // Store trial end date
    setIsLoggedIn(true);
    setUserEmail(email);
    setPlanType(planType);
    setTrialEndDate(trialEndDate);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('planType'); // Clear plan info on logout
    localStorage.removeItem('trialEndDate'); // Clear plan info on logout
    setIsLoggedIn(false);
    setUserEmail(null);
    setPlanType(null); // Clear state
    setTrialEndDate(null); // Clear state
    router.push('/login');
  };

  // NEW: Function to update plan (used when upgrading)
  const updatePlan = (newPlanType: AuthContextType['planType'], newTrialEndDate: string | null) => {
    localStorage.setItem('planType', newPlanType || '');
    localStorage.setItem('trialEndDate', newTrialEndDate || '');
    setPlanType(newPlanType);
    setTrialEndDate(newTrialEndDate);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, planType, trialEndDate, login, logout, updatePlan, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}