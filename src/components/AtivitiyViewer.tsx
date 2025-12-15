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
  className?: string;
  activity: Activity;
  index: number;
  sort: Sort;
};

const ActivityViewer: FC<Props> = ({ className, activity, index, sort }) => {
  return (
    <li
      className={cn("flex items-center md:w-full", className)}
      key={`${index}-${sort}`}
    >
      <div className="relative top-2/5 left-[-15px] md:left-[-19px] h-6 w-6 md:w-8 md:h-8 rounded-2xl bg-plum-500/90">
        <CheckCircleIcon
          className={cn(
            "size-6 md:size-8",
            activity.activeTo < new Date().toISOString()
              ? "text-plum-300"
              : "text-gray-500/50",
          )}
        />
      </div>
      <div className="ml-3 md:ml-10 flex flex-row lg:ml-30">
        <div className="md:mr-10 mr-5 md:w-45 w-30 shrink-0">
          <ImageWithPlaceholder
            src={getUrlsByType(activity.metaData, "img")}
            alt="img"
            className="h-auto w-full rounded-lg shadow-[0_13px_25px_rgba(97,120,150,0.4)]"
          />
        </div>
        <div className="h-auto border-l-3 border-slateBlue-600/40 pl-5 mr-5">
          <h1 className="text-lg font-bold text-plum-300">
            {getDate(activity.activeFrom)}
          </h1>
          <h1 className="mb-5 text-base md:text-lg md:font-bold text-gray-100">
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
      </div>
    </li>
  );
};

export default ActivityViewer;
