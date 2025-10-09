import configs from "@/config/config";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    configs.supabase_url,
    configs.supabase_key
  );
}
 