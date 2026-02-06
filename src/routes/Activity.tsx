import ActivityControls from "@/components/ActivityControls";
import ActivityViewer from "@/components/AtivitiyViewer";
import BlurBackground from "@/components/BlurBackground";
import { useActivities } from "@/hooks/backend/useActivities";
import type { Sort } from "@/types/sort";

import { useState, type FC } from "react";

const Activity: FC = () => {
  // const carouselRef = useRef(null);
  // const { scrollX } = useScroll({
  //   container: carouselRef,
  // });
  const [sort, setSort] = useState<Sort>("latest");
  const [year, setYear] = useState<string>("");
  const { activities } = useActivities(sort, year);

  return (
    <div className="relative scrollbar-hide h-dvh overflow-y-auto pt-50">
      <BlurBackground overlay overlayClassName="bg-gray-400/50" />
      {/* <div className="pointer-events-none fixed inset-x-0 top-0 z-2 h-[150px] bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm" /> */}

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
        <ul className="relative ml-6 border-l-6 border-gray-600/40 md:ml-10">
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
