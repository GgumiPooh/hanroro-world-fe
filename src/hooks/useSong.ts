import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type LanguageData = {
  language: string;
  content: string;
};

export type MetaData = {
  type: string;
  url: string;
};

export type SongDetail = {
  id: number;
  albumId: number;
  title?: LanguageData[];
  description?: LanguageData[];
  lyrics?: LanguageData[];
  metadata?: MetaData[];
  trackNumber?: number;
  createdAt?: string;
};

function resolveLocalizedText(
  items: string | LanguageData[] | undefined,
  preferred: string[] = ["ko", "en"],
): string {
  if (!items) return "";
  if (typeof items === "string") return items;
  if (items.length === 0) return "";
  for (const lang of preferred) {
    const found = items.find((x) => x.language?.toLowerCase() === lang);
    if (found?.content) return found.content;
  }
  return items[0]?.content ?? "";
}

async function fetchSong(songId: string | number): Promise<SongDetail | null> {
  const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/public/album/song/${songId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch song");
  }

  return res.json();
}

export function useSong(_albumId?: string | number, songId?: string | number) {
  const query = useQuery({
    queryKey: ["song", songId],
    queryFn: () => fetchSong(songId!),
    enabled: !!songId,
    staleTime: 60_000,
  });

  const detailView = useMemo(() => {
    if (!query.data) return null;

    const meta = query.data.metadata ?? [];
    const videoUrl = meta.find((m) => m.type === "video")?.url ?? "";
    const imgUrl = meta.find((m) => m.type === "img")?.url ?? "";

    return {
      ...query.data,
      title: resolveLocalizedText(query.data.title),
      description: resolveLocalizedText(query.data.description),
      lyrics: resolveLocalizedText(query.data.lyrics),
      videoUrl,
      imgUrl,
    };
  }, [query.data]);

  return {
    detail: query.data,
    detailView,
    isLoading: query.isLoading,
    error: query.error,
  };
}
