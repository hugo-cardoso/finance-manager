import { ConfigService } from "@nestjs/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_CLIENT = "SUPABASE_CLIENT";

export const SupabaseProvider = {
  provide: SUPABASE_CLIENT,
  inject: [ConfigService],
  useFactory: (): SupabaseClient => {
    return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  },
};
