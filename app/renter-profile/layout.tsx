import { redirect } from "next/navigation";
import { RenterSidebar } from "@/components/RenterSidebar";
import { RenterTopBar } from "@/components/RenterTopBar";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function RenterDashboardLayout({
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
      <RenterSidebar />
      <RenterTopBar />
      <main className="lg:ml-64 mt-16 p-6 md:p-8 min-h-[calc(100vh-4rem)] flex flex-col gap-8 transition-all">
        {children}
      </main>
    </div>
  );
}

