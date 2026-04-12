"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { account, databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Models } from "appwrite";

interface UserProfile {
  fullName: string;
  role: "owner" | "renter" | "both";
  email?: string;
  phone?: string;
  village?: string;
  address?: string;
  pincode?: string;
  fieldArea?: number;
  aadhaar?: string;
}

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  profile: UserProfile | null;
  loading: boolean;
  isProfileComplete: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isProfileComplete: false,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const doc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.userCollectionId,
        userId
      );
      setProfile(doc as unknown as UserProfile);
    } catch {
      console.log("No profile found for user:", userId);
      setProfile(null);
    }
  };

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
      await fetchProfile(currentUser.$id);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isProfileComplete = !!(profile?.phone && profile?.pincode);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isProfileComplete, 
      logout,
      refreshProfile: checkUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
