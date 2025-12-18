import { ENV_VARIABLE } from "@/utils/env-variable";
import { useEffect, useMemo, useState } from "react";

type LanguageData = {
  language: string;
  content: string;
};

type MetaData = {
  type: string;
  url: string;
};

export type Album = {
  id: string | number;
  title: LanguageData[];
  description?: LanguageData[];
  publishedAt?: string;
  // Backend may emit either "metadata" or "metaData"
  metadata?: MetaData[];
  metaData?: MetaData[];
  createdAt?: string;
};

function parseAlbumDate(album: Album): number {
  const candidate = album.publishedAt || album.createdAt || "";
  const time = Date.parse(candidate);
  return Number.isFinite(time) ? time : 0;
}

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

function getAllMeta(album: Album): MetaData[] {
  return (album.metadata ?? album.metaData ?? []) as MetaData[];
}

export function useAlbums(sort: "latest" | "oldest" = "latest") {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    const fetchAlbums = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
        const url = `${baseUrl}/api/public/album`;

        const res = await fetch(url, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Failed to fetch albums");
        }
        const raw = (await res.json()) as unknown;
        if (isCancelled) return;

        const list = Array.isArray(raw) ? (raw as Album[]) : [];
        const sorted = [...list].sort((a, b) => {
          const ta = parseAlbumDate(a);
          const tb = parseAlbumDate(b);
          return sort === "latest" ? tb - ta : ta - tb;
        });
        setAlbums(sorted);
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

    fetchAlbums();
    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [sort]);

  // Derived fields for convenience in UI
  const albumsView = useMemo(
    () =>
      albums.map((a) => {
        const meta = getAllMeta(a);
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
          ...a,
          titleText: resolveLocalizedText(a.title),
          descriptionText: resolveLocalizedText(a.description),
          coverUrl: cover,
        };
      }),
    [albums],
  );

  return { albums, albumsView, isLoading, error };
}
