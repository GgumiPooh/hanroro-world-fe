import { supabase } from "@/lib/supabase";
import { albumDetailSchema } from "@/schemas/album";
import { songArraySchema } from "@/schemas/song";
import type { AlbumDetail } from "@/types/album";
import type { LanguageData } from "@/types/common";
import type { Nullable, Optional } from "@/types/misc";
import type { Song } from "@/types/song";
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

async function fetchAlbumDetail(
  albumId: string | number,
): Promise<{ album: Nullable<AlbumDetail>; songs: Song[] }> {
  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("*")
    .eq("id", albumId)
    .single();

  if (albumError) {
    throw new Error(albumError.message);
  }

  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*")
    .eq("album_id", albumId)
    .order("track_number", { ascending: true });

  if (songsError) {
    throw new Error(songsError.message);
  }

  const validatedAlbum = album ? albumDetailSchema.parse(album) : null;
  const validatedSongs = songArraySchema.parse(songs ?? []);

  return { album: validatedAlbum, songs: validatedSongs };
}

export function useAlbumDetailSupabase(albumId?: string | number) {
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
