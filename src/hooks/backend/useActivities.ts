import type { Sort } from "@/types/sort";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useEffect, useState } from "react";

type Title = {
  language: string;
  content: string;
};
type MetaData = {
  type: string;
  url: string;
};
export type Activity = {
  id: string;
  title: Title[];
  activeFrom: string;
  activeTo: string;
  metaData: MetaData[];
};

export function useActivities(sort: Sort, year: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    const fetchActivity = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (year) params.set("year", year);
        if (sort) params.set("sort", sort);

        const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
        const url = `${baseUrl}/api/public/activity?${params.toString()}`;

        const res = await fetch(url, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Failed to fetch activity");
        }

        const rawActivities = await res.json();
        if (!isCancelled) {
          setActivities(rawActivities as Activity[]);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isCancelled) return;
        const isAbortError =
          err instanceof DOMException
            ? err.name === "AbortError"
            : typeof err === "object" &&
              err !== null &&
              "name" in err &&
              (err as { name?: string }).name === "AbortError";
        if (isAbortError) return;
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      }
    };

    fetchActivity();
    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [sort, year]);

  return { activities, isLoading, error };
}
