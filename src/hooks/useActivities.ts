import { A_MINUTE, ACTIVITY_TYPE } from "@/constants/misc";
import { supabase } from "@/lib/supabase";
import { activityArraySchema } from "@/schemas/activity";
import type { Activity } from "@/types/activity";
import type { Sort } from "@/types/sort";
import { useQuery } from "@tanstack/react-query";

async function fetchActivities(sort: Sort, year: string): Promise<Activity[]> {
  let query = supabase.from("activities").select("*");

  query = query.eq("type", ACTIVITY_TYPE.PERFORMANCE);

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    query = query.gte("active_from", startDate).lte("active_from", endDate);
  }

  const ascending = sort === "oldest";
  query = query.order("active_from", { ascending });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const transformed = (data ?? []).map((item) => ({
    id: item.id,
    title: item.title ?? [],
    activityType: item.type,
    activeFrom: item.active_from,
    activeTo: item.active_to,
    metaData: item.meta_data ?? [],
  }));

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
