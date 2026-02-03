import { A_MINUTE } from "@/constants/misc";
import { supabase } from "@/lib/supabase";
import { songSchema } from "@/schemas/song";
import type { Nullable } from "@/types/misc";
import type { Song } from "@/types/song";
import { selectLocalizedText } from "@/utils/localization";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

async function fetchSong(songId: string | number): Promise<Nullable<Song>> {
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

export function useSong(songId?: string | number) {
  const query = useQuery({
    queryKey: ["song", songId],
    queryFn: () => {
      if (!songId) {
        throw new Error("songId is required");
      }
      return fetchSong(songId);
    },
    enabled: !!songId,
    staleTime: A_MINUTE,
  });

  const detailView = useMemo(() => {
    if (!query.data) return null;

    const metadata = query.data.metadata ?? [];
    const videoUrl = metadata.find((item) => item.type === "video")?.url ?? "";
    const imageUrl = metadata.find((item) => item.type === "img")?.url ?? "";

    return {
      ...query.data,
      title: selectLocalizedText(query.data.title),
      description: selectLocalizedText(query.data.description),
      lyrics: selectLocalizedText(query.data.lyrics),
      videoUrl,
      imageUrl,
    };
  }, [query.data]);

  return {
    detail: query.data,
    detailView,
    isLoading: query.isLoading,
    error: query.error,
  };
}
