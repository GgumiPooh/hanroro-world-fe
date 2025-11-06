import type { Sort } from "@/types/sort";
import { useEffect, useState } from "react";

type Activity = {
  id: string;
  title: string;
  description: string;
  activeFrom: string;
  activeTo: string;
  metaData: any[];
};

export function useActivities(sort: Sort) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      const res = await fetch("http://localhost:8080/api/activity");

      if (!res.ok) {
        const error = new Error("Failed to fetch activity");
        setError(error);
        setIsLoading(false);
        return;
      }

      const rawActivities = await res.json();
      setActivities(rawActivities as Activity[]);
      setIsLoading(false);
    };

    fetchActivity();
  }, []);

  useEffect(() => {
    const sortedActivities = sortActivities(activities, sort);
    setActivities(sortedActivities);
  }, [activities, sort]);

  return { activities, isLoading, error };
}

function sortActivities(activities: Activity[], sort: Sort) {
  const sortedActivities = activities.sort((a, b) => {
    if (sort === "oldest") {
      return (
        new Date(a.activeFrom).getTime() - new Date(b.activeFrom).getTime()
      );
    }

    return new Date(b.activeFrom).getTime() - new Date(a.activeFrom).getTime();
  });

  return sortedActivities;
}
