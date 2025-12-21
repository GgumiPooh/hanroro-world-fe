import { supabase } from "@/lib/supabase";
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
  album_id: number;
  title?: LanguageData[];
  description?: LanguageData[];
  lyrics?: LanguageData[];
  metadata?: MetaData[];
  track_number?: number;
  created_at?: string;
};

export type AlbumDetail = {
  id: number;
  title: LanguageData[];
  description?: LanguageData[];
  published_at?: string;
  metadata?: MetaData[];
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

async function fetchAlbumDetail(
  albumId: string | number,
): Promise<{ album: AlbumDetail | null; songs: Song[] }> {
  // Fetch album
  const { data: album, error: albumError } = await supabase
    .from("albums")
    .select("*")
    .eq("id", albumId)
    .single();

  if (albumError) {
    throw new Error(albumError.message);
  }

  // Fetch songs for this album
  const { data: songs, error: songsError } = await supabase
    .from("songs")
    .select("*")
    .eq("album_id", albumId)
    .order("track_number", { ascending: true });

  if (songsError) {
    throw new Error(songsError.message);
  }

  return { album, songs: songs ?? [] };
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
