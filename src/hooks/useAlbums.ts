import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type LanguageData = {
  language: string;
  content: string;
};

type MetaData = {
  type: string;
  url: string;
};

export type Album = {
  id: number;
  title: LanguageData[];
  description?: LanguageData[] | null;
  metadata?: MetaData[] | null;
  albumType?: string | null;
  publishedAt?: string | null;
  created_at?: string | null;
};

function resolveLocalizedText(
  items: LanguageData[] | undefined | null,
  preferred: string[] = ["ko", "en"],
): string {
  if (!items || items.length === 0) return "";
  for (const lang of preferred) {
    const found = items.find((x) => x.language?.toLowerCase() === lang);
    if (found?.content) return found.content;
  }
  return items[0]?.content ?? "";
}

async function fetchAlbums(): Promise<Album[]> {
  const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/public/album`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch albums");
  }

  return res.json();
}

async function fetchAlbumSongs(
  albumId: number,
): Promise<{ id: number; trackNumber?: number }[]> {
  const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
  const res = await fetch(`${baseUrl}/api/public/album/${albumId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch album songs");
  }

  const songs = await res.json();
  return songs.map((s: { id: number; trackNumber?: number }) => ({
    id: s.id,
    trackNumber: s.trackNumber,
  }));
}

export function useAlbums() {
  const albumsQuery = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
    staleTime: 60_000,
  });

  const albumsView = useMemo(() => {
    if (!albumsQuery.data) return [];

    return albumsQuery.data.map((album) => {
      const meta = album.metadata ?? [];
      const lower = meta.map((m) => ({
        type: (m.type || "").toLowerCase(),
        url: m.url,
      }));
      const cover =
        lower.find((m) => m.type.includes("cover"))?.url ||
        lower.find((m) => m.type.includes("img"))?.url ||
        lower.find((m) => m.type.includes("image"))?.url ||
        lower[0]?.url ||
        "";

      return {
        ...album,
        titleText: resolveLocalizedText(album.title),
        descriptionText: resolveLocalizedText(album.description),
        coverUrl: cover,
        firstSongId: null as number | null,
        albumType: album.albumType,
      };
    });
  }, [albumsQuery.data]);

  return {
    albums: albumsQuery.data ?? [],
    albumsView,
    isLoading: albumsQuery.isLoading,
    error: albumsQuery.error,
    fetchAlbumSongs,
  };
}
