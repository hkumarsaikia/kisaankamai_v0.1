"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
<<<<<<< HEAD
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserProfile {
  fullName: string;
  role: "owner" | "renter" | "both";
  email?: string;
  phone?: string;
  village?: string;
  address?: string;
  pincode?: string;
  fieldArea?: number;
}
=======
import { account, databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { Models } from "appwrite";
import { DEMO_AUTH_CONFIG, DemoUserProfile, clearDemoSession, readDemoSession } from "@/lib/demoAuth";

type UserProfile = DemoUserProfile;
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  };

<<<<<<< HEAD
=======
  const checkUser = async () => {
    if (DEMO_AUTH_CONFIG.enabled) {
      const demoSession = readDemoSession();
      setUser(demoSession?.user || null);
      setProfile(demoSession?.profile || null);
      setLoading(false);
      return;
    }

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

>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
<<<<<<< HEAD
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid);
=======
    if (DEMO_AUTH_CONFIG.enabled) {
      clearDemoSession();
      setUser(null);
      setProfile(null);
      return;
    }

    try {
      await account.deleteSession('current');
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
>>>>>>> 30ed3e1d4c9aed32cc903a3a18066a3681038ae1
  };

  const isProfileComplete = !!(profile?.phone && profile?.pincode);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isProfileComplete, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
