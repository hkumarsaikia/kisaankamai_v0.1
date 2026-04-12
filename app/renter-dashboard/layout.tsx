"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { RenterSidebar } from "@/components/RenterSidebar";
import { RenterTopBar } from "@/components/RenterTopBar";

export default function RenterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      console.error("Auth check failed: Not logged in");
        router.push("/login");
      return;
    }

    setLoading(false);
  }, [authLoading, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <RenterSidebar />
      <RenterTopBar />
      <main className="lg:ml-64 mt-16 p-6 md:p-8 min-h-[calc(100vh-4rem)] flex flex-col gap-8 transition-all">
        {children}
      </main>
    </div>
  );
}
