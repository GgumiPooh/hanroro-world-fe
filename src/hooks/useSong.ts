import { A_MINUTE } from "@/constants/misc";
import { supabase } from "@/lib/supabase";
import { songSchema } from "@/schemas/song";
import type { Nullable } from "@/types/misc";
import type { Song } from "@/types/song";
import { assert } from "@/utils/assert";
import { selectLocalizedText } from "@/utils/localization";
import { findMetadataUrl } from "@/utils/metadata";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

async function fetchSong(songId: string | number): Promise<Nullable<Song>> {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", songId)
    .single();

  assert(!error, error?.message);

  return data ? songSchema.parse(data) : null;
}

export function useSong(songId?: string | number) {
  const query = useQuery({
    queryKey: ["song", songId],
    queryFn: () => {
      assert(songId, "songId is required");
      return fetchSong(songId);
    },
    enabled: !!songId,
    staleTime: A_MINUTE,
  });

  const detailView = useMemo(() => {
    if (!query.data) return null;

    const metadata = query.data.metadata ?? [];

    return {
      ...query.data,
      title: selectLocalizedText(query.data.title),
      description: selectLocalizedText(query.data.description),
      lyrics: selectLocalizedText(query.data.lyrics),
      videoUrl: findMetadataUrl(metadata, "video"),
      imageUrl: findMetadataUrl(metadata, "img"),
    };
  }, [query.data]);

  return {
    detail: query.data,
    detailView,
    isLoading: query.isLoading,
    error: query.error,
  };
}
