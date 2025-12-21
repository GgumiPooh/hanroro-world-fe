import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";

export type CurrentUser = {
  id?: string | number;
  name?: string;
  nickname?: string;
  username?: string;
  email?: string;
};

function resolveDisplayName(user: CurrentUser | null): string | null {
  if (!user) return null;
  return user.name || user.nickname || user.username || user.email || null;
}

async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
  const url = `${baseUrl}/api/auth/name`;
  const res = await fetch(url, { credentials: "include" });

  if (res.status === 401 || res.status === 403) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }
  const data = (await res.json()) as unknown;
  if (data && typeof data === "object") {
    return data as CurrentUser;
  }
  return null;
}

export function useCurrentUser() {
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
