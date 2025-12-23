import { supabase } from "@/lib/supabase";
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
  let query = supabase.from("activities").select("*");

  // PERFORMANCE 타입만 필터링
  query = query.eq("activity_type", "PERFORMANCE");

  // 연도 필터링
  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte("active_from", startDate).lte("active_from", endDate);
  }

  // 정렬
  const ascending = sort === "oldest";
  query = query.order("active_from", { ascending });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // 필드명 변환 (snake_case -> camelCase for backward compatibility)
  return (data ?? []).map((item) => ({
    ...item,
    title: item.title ?? [],
    activityType: item.activity_type,
    activeFrom: item.active_from, // snake_case from DB
    activeTo: item.active_to, // snake_case from DB
    metaData: item.meta_data ?? [], // snake_case from DB
  })) as Activity[];
}

export function useActivitiesSupabase(sort: Sort, year: string) {
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
