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

export type Song = {
  id: number;
  albumId: number;
  title?: LanguageData[];
  description?: LanguageData[];
  lyrics?: LanguageData[];
  metadata?: MetaData[];
  trackNumber?: number;
  createdAt?: string;
};

export type AlbumDetail = {
  id: number;
  title: LanguageData[];
  description?: LanguageData[];
  publishedAt?: string;
  metadata?: MetaData[];
  createdAt?: string;
  songs?: Song[];
};

function resolveLocalizedText(
  items: LanguageData[] | undefined,
  preferred: string[] = ["ko", "en"],
): string {
  if (!items || items.length === 0) return "";
  for (const lang of preferred) {
    const found = items.find((x) => x.language?.toLowerCase() === lang);
    if (found?.content) return found.content;
  }
  return items[0]?.content ?? "";
}

async function fetchAlbumDetail(
  albumId: string | number,
): Promise<{ album: AlbumDetail | null; songs: Song[] }> {
  const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";

  const albumRes = await fetch(`${baseUrl}/api/public/album`, {
    credentials: "include",
  });

  if (!albumRes.ok) {
    throw new Error("Failed to fetch albums");
  }

  const albums: AlbumDetail[] = await albumRes.json();
  const album = albums.find((a) => a.id === Number(albumId)) ?? null;

  const songsRes = await fetch(`${baseUrl}/api/public/album/${albumId}`, {
    credentials: "include",
  });

  if (!songsRes.ok) {
    throw new Error("Failed to fetch songs");
  }

  const songs: Song[] = await songsRes.json();

  return { album, songs: songs ?? [] };
}

export function useAlbumDetail(albumId?: string | number) {
  const query = useQuery({
    queryKey: ["albumDetail", albumId],
    queryFn: () => fetchAlbumDetail(albumId!),
    enabled: !!albumId,
    staleTime: 60_000,
  });

  const detailView = useMemo(() => {
    if (!query.data) return { songsView: [] };

    const songsView = (query.data.songs ?? []).map((s) => ({
      ...s,
      title: resolveLocalizedText(s.title),
      description: resolveLocalizedText(s.description),
      lyrics: resolveLocalizedText(s.lyrics),
      trackNumber: s.trackNumber,
    }));

    return { songsView };
  }, [query.data]);

  return {
    detail: query.data?.album ?? null,
    detailView,
    isLoading: query.isLoading,
    error: query.error,
  };
}
