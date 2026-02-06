import { ENV_VARIABLE } from "@/utils/env-variable";
import type { Sort } from "@/types/sort";
import { useQuery } from "@tanstack/react-query";

type Title = {
  language: string;
  content: string;
};

type MetaData = {
  type: string;
  url: string;
};

export type Activity = {
  id: number;
  title: Title[];
  activityType?: string;
  activeFrom: string;
  activeTo: string;
  metaData: MetaData[];
};

async function fetchActivities(sort: Sort, year: string): Promise<Activity[]> {
  const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
  const params = new URLSearchParams();
  
  if (year) {
    params.append("year", year);
  }
  params.append("sort", sort === "oldest" ? "oldest" : "latest");

  const res = await fetch(
    `${baseUrl}/api/public/activity?${params.toString()}`,
    { credentials: "include" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch activities");
  }

  const data = await res.json();

  return (data ?? []).map((item: {
    id: number;
    title: Title[];
    type?: string;
    activeFrom: string;
    activeTo: string;
    metaData?: MetaData[];
  }) => ({
    ...item,
    title: item.title ?? [],
    activityType: item.type,
    metaData: item.metaData ?? [],
  })) as Activity[];
}

export function useActivities(sort: Sort, year: string) {
  const query = useQuery({
    queryKey: ["activities", sort, year],
    queryFn: () => fetchActivities(sort, year),
    staleTime: 60_000,
  });

  return {
    activities: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
