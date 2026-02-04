import { A_MINUTE } from "@/constants/misc";
import { userSchema } from "@/schemas/user";
import type { Nullable } from "@/types/misc";
import type { User } from "@/types/user";
import { assert } from "@/utils/assert";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";

async function fetchCurrentUser(): Promise<Nullable<User>> {
  const res = await fetch(`${ENV_VARIABLE.API_BASE_URL}/api/auth/name`, {
    credentials: "include",
  });

  assert(res.ok, "Failed to fetch current user");

  const data: unknown = await res.json();
  return userSchema.parse(data);
}

export function useCurrentUser() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["currentUser"],
    staleTime: A_MINUTE,
    queryFn: fetchCurrentUser,
  });

  const displayName = data?.name || data?.nickname || null;

  return {
    user: data,
    displayName,
    isLoading,
    error,
    refetch,
  };
}
