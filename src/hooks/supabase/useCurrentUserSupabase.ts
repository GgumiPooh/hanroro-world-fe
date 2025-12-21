import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export type CurrentUser = {
  id: string;
  email?: string;
  name?: string;
  nickname?: string;
  avatar_url?: string;
};

function resolveDisplayName(user: CurrentUser | null): string | null {
  if (!user) return null;
  return user.name || user.nickname || user.email || null;
}

async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get additional user profile from users table if exists
  const { data: profile } = await supabase
    .from("users")
    .select("name, nickname, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    name: profile?.name || user.user_metadata?.name,
    nickname: profile?.nickname || user.user_metadata?.nickname,
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
  };
}

export function useCurrentUserSupabase() {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 60_000,
  });

  const displayName = resolveDisplayName(query.data ?? null);

  return {
    ...query,
    user: query.data,
    displayName,
  };
}

// Auth helper functions
export async function signInWithOAuth(provider: "google" | "kakao" | "github") {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("OAuth sign in error:", error);
    throw error;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

export function onAuthStateChange(
  callback: (user: CurrentUser | null) => void,
) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const user = await fetchCurrentUser();
      callback(user);
    } else {
      callback(null);
    }
  });
}
