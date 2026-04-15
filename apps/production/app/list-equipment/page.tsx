import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/server/auth";

export default async function ListEquipmentPage() {
  const session = await getCurrentSession();
  redirect(session ? "/owner-dashboard" : "/login");
}
