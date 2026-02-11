import { A_MINUTE } from "@/constants/misc";
import { albumArraySchema } from "@/schemas/album";
import type { Album } from "@/types/album";
import { assert } from "@/utils/assert";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { selectLocalizedText } from "@/utils/localization";
import { findCoverUrl } from "@/utils/metadata";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

async function fetchAlbums(): Promise<Album[]> {
  const baseUrl = ENV_VARIABLE.API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/public/album`, {
    credentials: "include",
  });

  assert(res.ok, "Failed to fetch albums");

  const data: unknown = await res.json();

  // 백엔드 응답을 프론트엔드 스키마에 맞게 변환
  const transformed = (data as Array<Record<string, unknown>>).map((album) => ({
    id: album.id as number,
    title: album.title as Array<{ language: string; content: string }>,
    description: album.description as
      | Array<{ language: string; content: string }>
      | undefined,
    metadata: album.metadata as Array<{ type: string; url: string }> | undefined,
    album_type: album.albumType as string | undefined,
    published_at: album.publishedAt as string | undefined,
    created_at: album.createdAt as string | undefined,
    songs: (album.songs as Array<{ id: number; trackNumber?: number }> | undefined)?.map(
      (s) => ({ id: s.id, track_number: s.trackNumber }),
    ),
  }));

  return albumArraySchema.parse(transformed);
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
      const coverUrl = findCoverUrl(album.metadata ?? []);

      const sortedSongs = [...(album.songs ?? [])].sort(
        (songA, songB) => (songA.track_number ?? 0) - (songB.track_number ?? 0),
      );
      const firstSongId = sortedSongs[0]?.id ?? null;

      return {
        ...album,
        titleText: selectLocalizedText(album.title),
        descriptionText: selectLocalizedText(album.description ?? undefined),
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
