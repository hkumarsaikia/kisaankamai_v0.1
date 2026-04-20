import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function RenterProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return children;
}
