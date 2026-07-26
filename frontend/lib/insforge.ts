import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || "https://gnitfu5w.ap-southeast.insforge.app",
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "anon_c1c3a278a642411eb5a09d7b3d345aed193734902908a16b3f97089abe52db91",
});
