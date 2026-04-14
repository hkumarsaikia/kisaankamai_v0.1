import { registerProcessBugHandlers } from "@/lib/server/bug-reporting";

export async function register() {
  registerProcessBugHandlers();
}
