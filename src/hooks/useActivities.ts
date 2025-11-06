import { useEffect, useState } from "react";

type Activity = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeFrom: string;
  activeTo: string;
  metaData: any[];
};

export function useActivities() {
  const [activities, setActivity] = useState<Activity[]>([]);
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
      setActivity(rawActivities as Activity[]);
      setIsLoading(false);
    };

    fetchActivity();
  }, []);

  return { activities, isLoading, error };
}
