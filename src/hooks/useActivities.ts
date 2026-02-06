import { A_MINUTE } from "@/constants/misc";
import { activityArraySchema } from "@/schemas/activity";
import type { Activity } from "@/types/activity";
import type { Sort } from "@/types/sort";
import { assert } from "@/utils/assert";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

async function fetchActivities(
  sort: Sort,
  year: string,
  page = 0,
  size = 100,
): Promise<Activity[]> {
  const params = new URLSearchParams({
    sort,
    page: String(page),
    size: String(size),
  });

  if (year) {
    params.set("year", year);
  }

  const baseUrl = ENV_VARIABLE.API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/public/activity?${params}`, {
    credentials: "include",
  });

  assert(res.ok, "Failed to fetch activities");

  const data: unknown = await res.json();
  const pageResponse = data as PageResponse<unknown>;

  const transformed = (pageResponse.content ?? []).map((item) => {
    const activityItem = item as Record<string, unknown>;
    return {
      id: activityItem.id as number,
      title: (activityItem.title as Array<{ language: string; text: string }>) ?? [],
      activityType: activityItem.activityType as string | undefined,
      activeFrom: activityItem.activeFrom as string,
      activeTo: activityItem.activeTo as string,
      metaData: (activityItem.metaData as Array<{ type: string; value: string }>) ?? [],
    };
  });

  return activityArraySchema.parse(transformed);
}

export function useActivities(sort: Sort, year: string) {
  const query = useQuery({
    queryKey: ["activities", sort, year],
    queryFn: () => fetchActivities(sort, year),
    staleTime: A_MINUTE,
  });

  return {
    activities: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
