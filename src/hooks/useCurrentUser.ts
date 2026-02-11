import { A_MINUTE } from "@/constants/misc";
import { userSchema } from "@/schemas/user";
import type { Nullable } from "@/types/misc";
import type { User } from "@/types/user";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";

const USER_CACHE_KEY = "currentUser";

function getCachedUser(): Nullable<User> {
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (!cached) return null;
    return userSchema.parse(JSON.parse(cached));
  } catch {
    localStorage.removeItem(USER_CACHE_KEY);
    return null;
  }
}

function setCachedUser(user: Nullable<User>) {
  if (user) {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_CACHE_KEY);
  }
}

async function fetchCurrentUser(): Promise<Nullable<User>> {
  const res = await fetch(`${ENV_VARIABLE.API_BASE_URL}/api/auth/name`, {
    credentials: "include",
  });

  // 401이면 로그아웃 상태
  if (res.status === 401) {
    setCachedUser(null);
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  const data: unknown = await res.json();
  const user = userSchema.parse(data);
  setCachedUser(user);
  return user;
}

export function useCurrentUser() {
  const cachedUser = getCachedUser();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["currentUser"],
    staleTime: A_MINUTE * 5,
    gcTime: A_MINUTE * 10,
    initialData: cachedUser ?? undefined,
    queryFn: fetchCurrentUser,
  });

  const displayName = data?.name || data?.nickname || null;

  return {
    user: data,
    displayName,
    isLoading: cachedUser ? false : isLoading, // 캐시 있으면 로딩 아님
    error,
    refetch,
  };
}
