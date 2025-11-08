import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import type { Activity } from "@/hooks/useActivities";
import type { Sort } from "@/types/sort";
import { cn } from "@/utils/styles";
import { CheckCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";

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

type Props = {
  activity: Activity;
  index: number;
  sort: Sort;
};

const ActivityViewer: FC<Props> = ({ activity, index, sort }) => {
  return (
    <ul className="mb-40 flex items-center md:w-full w-6 " key={`${index}-${sort}`}>
      <div className="relative top-2/5 left-[-19px] h-8 w-8 rounded-2xl bg-plum-500/90">
        <CheckCircleIcon
          className={cn(
            "size-8",
            activity.activeTo < new Date().toISOString()
              ? "text-plum-300"
              : "text-gray-500/50",
          )}
        />
      </div>
      <li className="ml-30 flex flex-row">
        <div className="mr-10 w-45">
          <ImageWithPlaceholder
            src={getUrlsByType(activity.metaData, "img")}
            alt="img"
            className="h-auto w-full rounded-lg shadow-[0_13px_25px_rgba(97,120,150,0.4)]"
          />
        </div>
        <div className="border-l-3 border-slateBlue-600/40 pl-5">
          <h1 className="text-lg font-bold text-plum-300">
            {getDate(activity.activeFrom)}
          </h1>
          <h1 className="mb-5 text-lg font-bold text-gray-100">
            {getTitle(activity.title, "kor")}
          </h1>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              window.open(getUrlsByType(activity.metaData, "video"), "_blank");
            }}
          >
            <VideoCameraIcon className="size-4" />
          </Button>
        </div>
      </li>
    </ul>
  );
};

export default ActivityViewer;
