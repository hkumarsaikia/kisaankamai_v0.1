"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { OwnerSidebar } from "@/components/OwnerSidebar";
import { OwnerTopBar } from "@/components/OwnerTopBar";

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionUser = await account.get();
        if (!sessionUser) throw new Error("Not logged in");
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <OwnerSidebar />
      <OwnerTopBar />
      <main className="lg:ml-64 mt-16 p-6 md:p-8 min-h-[calc(100vh-4rem)] flex flex-col gap-8 transition-all">
        {children}
      </main>
    </div>
  );
}
