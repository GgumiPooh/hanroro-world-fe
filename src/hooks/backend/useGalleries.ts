import { ENV_VARIABLE } from "@/utils/env-variable";
import { useCallback, useEffect, useState } from "react";

export type GalleryItem = {
  id: number;
  title: string;
  description: string | null;
  authorName: string;
  authorId: number | null;
  imageUrls: string[];
  likeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
};

type PageResponse = {
  content: GalleryItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};

type UseGalleriesConfig = {
  pageSize?: number;
  autoFetch?: boolean;
};

export function useGalleries(config: UseGalleriesConfig = {}) {
  const { pageSize = 6, autoFetch = true } = config;

  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  const fetchGalleries = useCallback(
    async (pageNum: number = 0, append: boolean = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
        const res = await fetch(
          `${baseUrl}/api/public/gallery?page=${pageNum}&size=${pageSize}`,
          { credentials: "include" },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch galleries");
        }

        const data = (await res.json()) as PageResponse;

        if (append) {
          setGalleries((prev) => [...prev, ...data.content]);
        } else {
          setGalleries(data.content);
        }

        setPage(data.number);
        setHasMore(!data.last);
        setTotalElements(data.totalElements);
      } catch (err) {
        console.error("Failed to load galleries:", err);
        setError("게시물을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  const searchGalleries = useCallback(
    async (keyword: string, pageNum: number = 0) => {
      setIsLoading(true);
      setError(null);

      try {
        const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
        const res = await fetch(
          `${baseUrl}/api/public/gallery/search?keyword=${encodeURIComponent(keyword)}&page=${pageNum}&size=${pageSize}`,
          { credentials: "include" },
        );

        if (!res.ok) {
          throw new Error("Failed to search galleries");
        }

        const data = (await res.json()) as PageResponse;

        setGalleries(data.content);
        setPage(data.number);
        setHasMore(!data.last);
        setTotalElements(data.totalElements);
      } catch (err) {
        console.error("Failed to search galleries:", err);
        setError("검색에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchGalleries(page + 1, true);
    }
  }, [fetchGalleries, hasMore, isLoading, page]);

  useEffect(() => {
    if (autoFetch) {
      fetchGalleries(0);
    }
  }, [autoFetch, fetchGalleries]);

  return {
    galleries,
    isLoading,
    error,
    hasMore,
    totalElements,
    loadMore,
    search: searchGalleries,
    refresh: () => fetchGalleries(0),
  };
}
