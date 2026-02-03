import { A_MINUTE } from "@/constants/misc";
import { supabase } from "@/lib/supabase";
import { albumDetailSchema } from "@/schemas/album";
import { songArraySchema } from "@/schemas/song";
import type { AlbumDetail } from "@/types/album";
import type { Nullable } from "@/types/misc";
import type { Song } from "@/types/song";
import { selectLocalizedText } from "@/utils/localization";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

export function useAlbumDetail(albumId?: string | number) {
  const query = useQuery({
    queryKey: ["albumDetail", albumId],
    queryFn: () => {
      if (!albumId) {
        throw new Error("albumId is required");
      }
      return fetchAlbumDetail(albumId);
    },
    enabled: !!albumId,
    staleTime: A_MINUTE,
  });

  const detailView = useMemo(() => {
    if (!query.data) return { songsView: [] };

    const songsView = (query.data.songs ?? []).map((song) => ({
      ...song,
      title: selectLocalizedText(song.title),
      description: selectLocalizedText(song.description),
      lyrics: selectLocalizedText(song.lyrics),
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
