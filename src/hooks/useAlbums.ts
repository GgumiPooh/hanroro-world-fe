import { A_MINUTE } from "@/constants/misc";
import { supabase } from "@/lib/supabase";
import { albumArraySchema } from "@/schemas/album";
import type { Album } from "@/types/album";
import { selectLocalizedText } from "@/utils/localization";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

export function useAlbums() {
  const query = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAlbums,
    staleTime: A_MINUTE,
  });

  const albumsView = useMemo(() => {
    if (!query.data) return [];

    return query.data.map((album) => {
      const metadata = album.metadata ?? [];
      const normalizedMetadata = metadata.map((item) => ({
        type: (item.type || "").toLowerCase(),
        url: item.url,
      }));
      const coverUrl =
        normalizedMetadata.find((item) => item.type.includes("cover"))?.url ||
        normalizedMetadata.find((item) => item.type.includes("image"))?.url ||
        normalizedMetadata[0]?.url ||
        "";

      const sortedSongs = [...(album.songs ?? [])].sort(
        (songA, songB) => (songA.track_number ?? 0) - (songB.track_number ?? 0),
      );
      const firstSongId = sortedSongs[0]?.id ?? null;

      return {
        ...album,
        titleText: selectLocalizedText(album.title),
        descriptionText: selectLocalizedText(album.description),
        coverUrl,
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
