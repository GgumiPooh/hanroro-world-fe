import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

import { useEffect, useState, type FC } from "react";
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
  const [activity, setActivity] = useState<any[]>([]);
  useEffect(() => {
    const fetchActivity = async () => {
      const res = await fetch("http://localhost:8080/api/activity");
      if (!res.ok) throw new Error("Failed to fetch activity");
      const activity = await res.json();
      setActivity(activity);
    };
    fetchActivity();
  }, []);
  return (
    <div className="overflow-y-auto bg-slateBlue-950 pt-50">
      <div className="ml-120 border-l-5 border-plum-600/70">
        {activity.map((item: any) => (
          <ul key={item.id} className="mb-50 flex items-center">
            <div className="relative top-2/5 left-[-12px] h-5 w-5 rounded-2xl bg-plum-600/95" />
            <li className="ml-30 flex flex-row">
              <div className="mr-10 w-40">
                <ImageWithPlaceholder
                  src={getUrlsByType(item.metaData, "img")}
                  alt="img"
                  className="h-auto w-full rounded-2xl shadow-[0_13px_25px_rgba(97,120,150,0.4)]"
                />
              </div>
              <div className="border-l-3 border-slateBlue-600/40 pl-5">
                <h1 className="text-lg font-bold text-plum-400">
                  {getDate(item.activeFrom)}
                </h1>
                <h1 className="mb-5 text-lg font-bold text-plum-200">
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
