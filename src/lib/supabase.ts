import { assert } from "@/utils/assert";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = ENV_VARIABLE.SUPABASE_URL;
const supabaseAnonKey = ENV_VARIABLE.SUPABASE_ANON_KEY;
assert(
  supabaseUrl && supabaseAnonKey,
  "Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.",
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
