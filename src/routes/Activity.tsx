import ActivityCard from "@/components/ActivityCard";
import ActivityControls from "@/components/ActivityControls";
import BlurBackground from "@/components/BlurBackground";
import { useActivities } from "@/hooks/useActivities";
import type { Sort } from "@/types/sort";

import { useEffect, useRef, useState, type FC } from "react";

const Activity: FC = () => {
  const [sort, setSort] = useState<Sort>("latest");
  const [year, setYear] = useState<string>("");
  const {
    activities,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useActivities(sort, year);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer로 자동 로드
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="relative scrollbar-hide h-dvh overflow-y-auto pt-50">
      <BlurBackground overlay overlayClassName="bg-gray-400/50" />

      <h1 className="mb-50 text-center text-5xl font-bold text-gray-100 md:mb-70 md:text-8xl">
        Activity
      </h1>

      <div className="z-2 mx-auto w-full max-w-[750px] overflow-x-hidden px-4">
        <ActivityControls
          className="mb-15 ml-10 gap-15 md:mb-25 md:ml-40 md:gap-20"
          year={year}
          onYearChange={setYear}
          sort={sort}
          onSortChange={setSort}
        />

        {isLoading ? (
          <div className="py-20 text-center text-gray-400">로딩 중...</div>
        ) : (
          <ul className="relative ml-6 border-l-6 border-gray-600/40 md:ml-10">
            {activities.map((activityItem) => (
              <ActivityCard
                className="mb-40 w-full max-w-[660px]"
                key={activityItem.id}
                activity={activityItem}
              />
            ))}
          </ul>
        )}

        {/* 자동 로드 트리거 */}
        <div ref={loadMoreRef} className="h-10" />

        {isFetchingNextPage && (
          <div className="py-10 text-center text-gray-400">
            더 불러오는 중...
          </div>
        )}

        {!hasNextPage && activities.length > 0 && (
          <div className="py-10 text-center text-gray-500">
            모든 활동을 불러왔습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
