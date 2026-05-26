import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/types/database";

export const createClient = () => {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient<Database>(url, key);
};
