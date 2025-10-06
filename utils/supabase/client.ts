import { createBrowserClient } from "@supabase/ssr";
import configs from "../../config/config";

export function createClient() {
  return createBrowserClient(
    configs.supabase_url,
    configs.supabase_key
  );
}
 