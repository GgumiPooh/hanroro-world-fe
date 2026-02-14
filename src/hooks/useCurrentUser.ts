import { A_MINUTE } from "@/constants/misc";
import { userSchema } from "@/schemas/user";
import type { Nullable } from "@/types/misc";
import type { User } from "@/types/user";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";

const USER_CACHE_KEY = "currentUser";

function getCachedUser(): Nullable<User> {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
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

async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${ENV_VARIABLE.API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchCurrentUser(): Promise<Nullable<User>> {
  try {
    const res = await fetch(`${ENV_VARIABLE.API_BASE_URL}/api/auth/name`, {
      credentials: "include",
    });

    // 401이면 토큰 갱신 시도
    if (res.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // 토큰 갱신 성공 → 다시 요청
        const retryRes = await fetch(
          `${ENV_VARIABLE.API_BASE_URL}/api/auth/name`,
          { credentials: "include" },
        );
        if (retryRes.ok) {
          const data: unknown = await retryRes.json();
          const result = userSchema.safeParse(data);
          if (result.success) {
            setCachedUser(result.data);
            return result.data;
          }
        }
      }
      // 갱신 실패 → 로그아웃 상태
      setCachedUser(null);
      return null;
    }

    if (!res.ok) {
      // 401 외의 에러는 캐시 유지하고 null 반환 (임시 오류일 수 있음)
      console.error("Failed to fetch current user:", res.status);
      return getCachedUser();
    }

    const data: unknown = await res.json();
    const result = userSchema.safeParse(data);
    if (result.success) {
      setCachedUser(result.data);
      return result.data;
    }

    // 스키마 불일치 → 캐시 클리어
    console.error("User schema mismatch");
    setCachedUser(null);
    return null;
  } catch (err) {
    // 네트워크 오류 등 → 캐시 반환 (오프라인 지원)
    console.error("Network error fetching user:", err);
    return getCachedUser();
  }
}

export function useCurrentUser() {
  const { data, error, refetch, isFetched } = useQuery({
    queryKey: ["currentUser"],
    staleTime: A_MINUTE * 5,
    gcTime: A_MINUTE * 10,
    initialData: getCachedUser() ?? undefined,
    queryFn: fetchCurrentUser,
    retry: false, // 내부에서 이미 토큰 갱신 처리함
  });

  const displayName = data?.name || data?.nickname || null;

  return {
    user: data ?? null,
    displayName,
    isLoading: !isFetched && !data,
    error,
    refetch,
  };
}
