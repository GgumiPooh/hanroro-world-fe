import ActivityControls from "@/components/ActivityControls";
import ActivityViewer from "@/components/AtivitiyViewer";
import BlurBackground from "@/components/BlurBackground";
import { useActivitiesSupabase } from "@/hooks/supabase/useActivitiesSupabase";
import type { Sort } from "@/types/sort";

import { useState, type FC } from "react";

const Activity: FC = () => {
  // const carouselRef = useRef(null);
  // const { scrollX } = useScroll({
  //   container: carouselRef,
  // });
  const [sort, setSort] = useState<Sort>("latest");
  const [year, setYear] = useState<string>("");
  const { activities } = useActivitiesSupabase(sort, year);

  return (
    <div className="relative overflow-y-auto pt-50">
      <BlurBackground overlay overlayClassName="bg-gray-400/50" />
      {/* <div className="pointer-events-none fixed inset-x-0 top-0 z-2 h-[150px] bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm" /> */}

      <h1 className="mb-50 text-center text-5xl font-bold text-gray-100 md:mb-70 md:text-8xl">
        Activity
      </h1>

      <div className="z-2 mx-auto w-fit">
        <ActivityControls
          className="mb-25 ml-15 gap-15 md:ml-50 md:gap-20"
          year={year}
          onYearChange={setYear}
          sort={sort}
          onSortChange={setSort}
        />
        <ul className="relative mr-15 ml-10 w-fit border-l-6 border-gray-600/40">
          {activities.map((item, index) => (
            <ActivityViewer
              className="mb-50 w-full max-w-[660px]"
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
