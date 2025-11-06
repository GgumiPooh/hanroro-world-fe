import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { useActivities } from "@/hooks/useActivities";
import { cn } from "@/utils/styles";
import { CheckCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";

import { useState, type FC } from "react";
const getTitle = (titles: any[], lang = "kor") => {
  const found = titles.find((t) => t.language === lang);
  return found ? found.content : (titles[0]?.content ?? "");
};
const getUrlsByType = (meta: any[], type: string) => {
  const found = meta.find((m) => m.type === type);
  return found ? found.url : (meta[0]?.url ?? "");
};
const getDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // 월은 0부터 시작
  const day = date.getUTCDate();
  return `${year}.${month}.${day}`;
};

const Activity: FC = () => {
  // const carouselRef = useRef(null);
  // const { scrollX } = useScroll({
  //   container: carouselRef,
  // });
  const { activities, isLoading, error } = useActivities();

  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const handleSort = (sort: "latest" | "oldest") => {
    setSort(sort);
  };

  return (
    <div className="relative overflow-y-auto bg-gray-300/70 pt-50">
      <ImageWithPlaceholder
        className="fixed inset-0 -z-10 h-dvh w-full"
        imgClassName="object-cover object-center blur-lg backdrop-blur"
        src="/images/home-banner5.png"
        alt="home banner"
      />
      <div className="mb-30 ml-130 flex gap-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleSort("latest")}
          className={cn(
            sort === "latest" &&
              "cursor-default bg-plum-600/50 text-plum-300 hover:!scale-100 hover:!bg-plum-600/50 hover:!text-plum-300 hover:!ring-0 focus:!ring-0 active:!scale-100 active:!bg-plum-600/50",
          )}
        >
          최신순
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleSort("oldest")}
          // className={cn(sort === "oldest" && "disabled")}
          className={cn(
            sort === "oldest" &&
              // 기본(비-hover) 상태를 명시하고, hover/active/focus를 모두 무력화
              "cursor-default bg-plum-600/50 text-plum-300 hover:!scale-100 hover:!bg-plum-600/50 hover:!text-plum-300 hover:!ring-0 focus:!ring-0 active:!scale-100 active:!bg-plum-600/50",
          )}
        >
          오래된순
        </Button>
      </div>
      <div className="relative ml-120 border-l-6 border-plum-600/50">
        {activities
          .slice()
          .sort((a, b) => {
            if (sort === "oldest") {
              return (
                new Date(a.activeFrom).getTime() -
                new Date(b.activeFrom).getTime()
              );
            }
            return (
              new Date(b.activeFrom).getTime() -
              new Date(a.activeFrom).getTime()
            );
          })
          .map((item) => (
            <ul key={item.id} className="mb-40 flex items-center">
              <div className="relative top-2/5 left-[-19px] h-8 w-8 rounded-2xl bg-plum-500/90">
                <CheckCircleIcon
                  className={cn(
                    "size-8",
                    item.activeTo < new Date().toISOString()
                      ? "text-plum-300"
                      : "text-gray-500/50",
                  )}
                />
              </div>
              <li className="ml-30 flex flex-row">
                <div className="mr-10 w-45">
                  <ImageWithPlaceholder
                    src={getUrlsByType(item.metaData, "img")}
                    alt="img"
                    className="h-auto w-full rounded-lg shadow-[0_13px_25px_rgba(97,120,150,0.4)]"
                  />
                </div>
                <div className="border-l-3 border-slateBlue-600/40 pl-5">
                  <h1 className="text-lg font-bold text-plum-300">
                    {getDate(item.activeFrom)}
                  </h1>
                  <h1 className="mb-5 text-lg font-bold text-gray-100">
                    {getTitle(item.title, "kor")}
                  </h1>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      window.open(
                        getUrlsByType(item.metaData, "video"),
                        "_blank",
                      );
                    }}
                  >
                    <VideoCameraIcon className="size-4" />
                  </Button>
                </div>
              </li>
            </ul>
          ))}
      </div>
    </div>
  );
};

export default Activity;
