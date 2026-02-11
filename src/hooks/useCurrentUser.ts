import { A_MINUTE } from "@/constants/misc";
import { userSchema } from "@/schemas/user";
import type { Nullable } from "@/types/misc";
import type { User } from "@/types/user";
import { assert } from "@/utils/assert";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";

const USER_CACHE_KEY = "currentUser";

function getCachedUser(): Nullable<User> {
  // SSR/빌드 환경에서는 localStorage 없음
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    // 스키마 검증 실패해도 에러 던지지 않고 null 반환
    const result = userSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function setCachedUser(user: Nullable<User>) {
  if (typeof window === "undefined") return;

  try {
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_CACHE_KEY);
    }
  } catch {
    // localStorage 접근 실패해도 무시
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

  assert(res.ok, "Failed to fetch current user");

  const data: unknown = await res.json();
  const user = userSchema.parse(data);
  setCachedUser(user);
  return user;
}

export function useCurrentUser() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["currentUser"],
    staleTime: A_MINUTE * 5,
    gcTime: A_MINUTE * 10,
    initialData: getCachedUser() ?? undefined,
    queryFn: fetchCurrentUser,
  });

  const displayName = data?.name || data?.nickname || null;
  const hasCachedData = typeof window !== "undefined" && !!getCachedUser();

  return {
    user: data,
    displayName,
    isLoading: hasCachedData ? false : isLoading,
    error,
    refetch,
  };
}
