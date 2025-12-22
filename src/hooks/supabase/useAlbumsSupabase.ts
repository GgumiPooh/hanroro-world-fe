import { supabase } from "@/lib/supabase";
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

type Song = {
  id: number;
  track_number?: number;
};

export type Album = {
  id: number;
  title: LanguageData[];
  description?: LanguageData[];
  metadata?: MetaData[];
  album_type?: string;
  published_at?: string;
  created_at?: string;
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

async function fetchAlbums(): Promise<Album[]> {
  const { data, error } = await supabase
    .from("albums")
    .select("*, songs(id, track_number)")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export function useAlbumsSupabase() {
  const query = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
    staleTime: 60_000,
  });

  const albumsView = useMemo(() => {
    if (!query.data) return [];

    return query.data.map((album) => {
      const meta = album.metadata ?? [];
      const lower = meta.map((m) => ({
        type: (m.type || "").toLowerCase(),
        url: m.url,
      }));
      const cover =
        lower.find((m) => m.type.includes("cover"))?.url ||
        lower.find((m) => m.type.includes("image"))?.url ||
        lower[0]?.url ||
        "";

      // Get first track's song id (track_number = 1 or just the first in list)
      const sortedSongs = [...(album.songs ?? [])].sort(
        (a, b) => (a.track_number ?? 0) - (b.track_number ?? 0),
      );
      const firstSongId = sortedSongs[0]?.id ?? null;

      return {
        ...album,
        titleText: resolveLocalizedText(album.title),
        descriptionText: resolveLocalizedText(album.description),
        coverUrl: cover,
        firstSongId,
      };
    });
  }, [query.data]);

  return {
    albums: query.data ?? [],
    albumsView,
    isLoading: query.isLoading,
    error: query.error,
  };
}
