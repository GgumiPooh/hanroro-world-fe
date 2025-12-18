import { ENV_VARIABLE } from "@/utils/env-variable";
import { useEffect, useMemo, useState } from "react";

export type LanguageData = {
  language: string;
  content: string;
};

export type MetaData = {
  type: string;
  url: string;
};

export type Song = {
  id: string | number;
  // Backend uses List<Map<String,String>> for title; align with LanguageData for UI convenience
  title?: LanguageData[];
  description?: LanguageData[];
  lyrics?: LanguageData[];
  metadata?: MetaData[];
  metaData?: MetaData[];
};

export type AlbumDetail = {
  id: string | number;
  title: LanguageData[];
  description?: LanguageData[];
  publishedAt?: string;
  metadata?: MetaData[];
  metaData?: MetaData[];
  createdAt?: string;
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

function getAllMeta(meta?: MetaData[] | null, metaAlt?: MetaData[] | null) {
  return (meta ?? metaAlt ?? []) as MetaData[];
}

export function useAlbumDetail(albumId?: string | number) {
  const [detail, setDetail] = useState<AlbumDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (
      albumId === undefined ||
      albumId === null ||
      String(albumId).length === 0
    ) {
      setDetail(null);
      setSongs([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
        const url = `${baseUrl}/api/public/album/${albumId}`;
        const res = await fetch(url, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Failed to fetch album detail");
        }
        const raw = (await res.json()) as unknown;
        if (isCancelled) return;
        // Backend returns List<SongDto> for this endpoint.
        setSongs((raw as Song[]) ?? []);
        setIsLoading(false);
      } catch (err: unknown) {
        if (isCancelled) return;
        const isAbortError =
          err instanceof DOMException
            ? err.name === "AbortError"
            : typeof err === "object" &&
              err !== null &&
              "name" in err &&
              (err as { name?: string }).name === "AbortError";
        if (isAbortError) return;
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [albumId]);

  const detailView = useMemo(() => {
    // We currently only have songs from the backend endpoint.
    const songsView =
      (songs ?? []).map((s) => ({
        ...s,
        title: resolveLocalizedText(s.title),
        description: resolveLocalizedText(s.description),
        lyrics: resolveLocalizedText(s.lyrics),
      })) ?? [];
    return { songsView };
  }, [songs]);

  return { detail, detailView, isLoading, error };
}
