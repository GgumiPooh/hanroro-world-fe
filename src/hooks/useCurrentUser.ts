import { A_MINUTE } from "@/constants/misc";
import { userSchema } from "@/schemas/user";
import type { Nullable } from "@/types/misc";
import type { User } from "@/types/user";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";

async function fetchCurrentUser(): Promise<Nullable<User>> {
  const res = await fetch(`${ENV_VARIABLE.API_BASE_URL}/api/auth/name`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  return userSchema.parseAsync(res.json());
}

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["currentUser"],
    staleTime: A_MINUTE,
    queryFn: fetchCurrentUser,
  });

  const displayName = query.data?.name || query.data?.nickname || null;

  return {
    ...query,
    user: query.data,
    displayName,
  };
}
