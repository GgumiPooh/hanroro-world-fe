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
      <h1 className="text-center text-5xl font-bold text-gray-100/90 md:text-8xl">
        Activity
      </h1>
      <ImageWithPlaceholder
        className="fixed inset-0 -z-10 h-dvh w-full"
        imgClassName="object-cover object-center blur-lg backdrop-blur"
        src="/images/home-banner5.png"
        alt="home banner"
      />

      <SortOptions className="mx-auto w-fit" sort={sort} onChage={setSort} />

      <div className="mx-auto w-fit pl-6 md:pl-3">
        <ul className="relative w-fit border-l-6 border-plum-600/50">
          {activities.map((item, index) => (
            <ActivityViewer
              className="mb-40 w-full max-w-[660px]"
              key={`${index}-${sort}`}
              activity={item}
              index={index}
              sort={sort}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Activity;
