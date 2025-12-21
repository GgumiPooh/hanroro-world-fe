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

export type SongDetail = {
  id: string | number;
  // DTO may provide string or LanguageData[]
  title?: string | LanguageData[];
  description?: string | LanguageData[];
  lyrics?: string | LanguageData[];
  metadata?: MetaData[];
  // metaData?: MetaData[];
  createdAt?: string;
  [key: string]: unknown;
};

function resolveLocalizedText(
  items: string | LanguageData[] | undefined,
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

export function useSong(albumId?: string | number, songId?: string | number) {
  const [detail, setDetail] = useState<SongDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (
      !albumId ||
      !songId ||
      String(albumId).length === 0 ||
      String(songId).length === 0
    ) {
      setDetail(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    const controller = new AbortController();
    const fetchSong = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
        const url = `${baseUrl}/api/public/album/song/${songId}`;
        const res = await fetch(url, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Failed to fetch song detail");
        }
        const raw = (await res.json()) as unknown;
        if (isCancelled) return;
        setDetail(raw as SongDetail);
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
    fetchSong();
    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [albumId, songId]);

  const detailView = useMemo(() => {
    if (!detail) return null;
    const meta = detail.metadata ?? detail.metaData ?? [];
    const videoUrl = meta.find((m) => m.type === "video")?.url ?? "";
    const imgUrl = meta.find((m) => m.type === "img")?.url ?? "";
    return {
      ...detail,
      title: resolveLocalizedText(detail.title),
      description: resolveLocalizedText(detail.description),
      lyrics: resolveLocalizedText(detail.lyrics),
      videoUrl,
      imgUrl,
    };
  }, [detail]);

  return { detail, detailView, isLoading, error };
}
