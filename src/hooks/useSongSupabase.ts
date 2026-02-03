import { supabase } from "@/lib/supabase";
import { songSchema } from "@/schemas/song";
import type { LanguageData } from "@/types/common";
import type { Nullable, Optional } from "@/types/misc";
import type { SongDetail } from "@/types/song";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

function resolveLocalizedText(
  items: string | Optional<LanguageData[]>,
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

async function fetchSong(
  songId: string | number,
): Promise<Nullable<SongDetail>> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data ? songSchema.parse(data) : null;
}

export function useSongSupabase(
  _albumId?: string | number,
  songId?: string | number,
) {
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
