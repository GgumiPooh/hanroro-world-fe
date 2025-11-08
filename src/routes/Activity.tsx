import ActivityViewer from "@/components/AtivitiyViewer";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import SortOptions from "@/components/SortOptions";
import { useActivities } from "@/hooks/useActivities";
import type { Sort } from "@/types/sort";

import { useState, type FC } from "react";

const Activity: FC = () => {
  // const carouselRef = useRef(null);
  // const { scrollX } = useScroll({
  //   container: carouselRef,
  // });
  const [sort, setSort] = useState<Sort>("latest");
  const { activities, isLoading, error } = useActivities(sort);

  return (
    <div className="relative overflow-y-auto bg-gray-300/70 pt-50">
      <h1 className="mb-30 text-center text-5xl font-bold text-gray-100/90 md:text-8xl">
        Activity
      </h1>
      <ImageWithPlaceholder
        className="fixed inset-0 -z-10 h-dvh w-full"
        imgClassName="object-cover object-center blur-lg backdrop-blur"
        src="/images/home-banner5.png"
        alt="home banner"
      />

      <SortOptions sort={sort} onChage={setSort} />

      <div className="relative ml-20 border-l-6 border-plum-600/50 md:ml-35 lg:ml-80" key={sort}>
        {activities.map((item, index) => (
          <ActivityViewer
            key={`${index}-${sort}`}
            activity={item}
            index={index}
            sort={sort}
          />
        ))}
      </div>
    </div>
  );
};

export default Activity;
