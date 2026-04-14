import { redirect } from "next/navigation";
import { OwnerSidebar } from "@/components/OwnerSidebar";
import { OwnerTopBar } from "@/components/OwnerTopBar";
import { getCurrentSession } from "@/lib/server/firebase-auth";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
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

