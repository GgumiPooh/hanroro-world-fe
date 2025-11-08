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
      <ImageWithPlaceholder
        className="fixed inset-0 -z-10 h-dvh w-full"
        imgClassName="object-cover object-center blur-lg backdrop-blur"
        src="/images/home-banner5.png"
        alt="home banner"
      />

      <SortOptions sort={sort} onChage={setSort} />

      <div className="relative ml-120 border-l-6 border-plum-600/50" key={sort}>
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
