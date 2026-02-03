import { supabase } from "@/lib/supabase";
import { albumArraySchema } from "@/schemas/album";
import type { Album } from "@/types/album";
import type { LanguageData } from "@/types/common";
import type { Optional } from "@/types/misc";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

function resolveLocalizedText(
  items: Optional<LanguageData[]>,
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

  return albumArraySchema.parse(data ?? []);
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
