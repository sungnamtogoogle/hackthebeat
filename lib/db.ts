import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type PartyRegistrationInsert = {
  name: string;
  graduation_year: number;
  party_mood: string | null;
};

export function isDatabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabase(): SupabaseClient {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not configured.");
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getRegistrationCount() {
  const { count, error } = await getSupabase()
    .from("party_registrations")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function createRegistration(registration: PartyRegistrationInsert) {
  const { error } = await getSupabase().from("party_registrations").insert(registration);

  if (error) {
    throw error;
  }
}
