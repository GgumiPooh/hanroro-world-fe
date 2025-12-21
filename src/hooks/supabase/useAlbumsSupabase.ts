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

export type Album = {
  id: number;
  title: LanguageData[];
  description?: LanguageData[];
  metadata?: MetaData[];
  published_at?: string;
  created_at?: string;
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
    .select("*")
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

      return {
        ...album,
        titleText: resolveLocalizedText(album.title),
        descriptionText: resolveLocalizedText(album.description),
        coverUrl: cover,
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
