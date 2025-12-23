import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import type { Activity } from "@/hooks/supabase/useActivitiesSupabase";
import type { Sort } from "@/types/sort";
import { cn } from "@/utils/styles";
import { CheckCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";

const getTitle = (
  titles: { language: string; content: string }[],
  lang = "kor",
) => {
  const found = titles.find((t) => t.language === lang);
  return found ? found.content : (titles[0]?.content ?? "");
};
const getUrlsByType = (meta: { type: string; url: string }[], type: string) => {
  const found = meta.find((m) => m.type === type);
  return found ? found.url : (meta[0]?.url ?? "");
};
const isLocalDate = (value: string) =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));
const todayYMD = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const isPast = (value: string) => {
  if (!value) return false;
  if (isLocalDate(value)) {
    // LocalDate: compare lexicographically with today's YYYY-MM-DD
    return value < todayYMD();
  }
  // Fallback to Date comparison
  const t = Date.parse(value);
  return Number.isFinite(t) ? t < Date.now() : false;
};
const getDate = (value: string) => {
  if (!value) return "";
  if (isLocalDate(value)) {
    // Show as YYYY.MM.DD without timezone conversion
    return value.replaceAll("-", ".");
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getUTCFullYear()}.${d.getUTCMonth() + 1}.${d.getUTCDate()}`;
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
      className={cn("mr-3 flex items-center md:w-full", className)}
      key={`${index}-${sort}`}
    >
      <div className="relative top-2/5 left-[-15px] h-6 w-6 rounded-2xl bg-gray-500/90 md:left-[-19px] md:h-8 md:w-8">
        <CheckCircleIcon
          className={cn(
            "size-6 md:size-8",
            isPast(activity.activeTo) ? "text-plum-300" : "text-gray-500/50",
          )}
        />
      </div>
      <div className="ml-3 flex flex-row md:ml-30">
        <div className="mr-5 w-30 shrink-0 md:mr-10 md:w-45">
          <ImageWithPlaceholder
            src={getUrlsByType(activity.metaData, "img")}
            alt="img"
            className="h-auto w-full rounded-lg shadow-[0_13px_25px_rgba(97,120,150,0.4)]"
          />
        </div>
        <div className="mr-5 h-auto border-l-3 border-slateBlue-600/40 pl-5">
          <h1 className="text-lg font-bold text-plum-300">
            {getDate(activity.activeFrom)}
          </h1>
          <h1 className="mb-5 text-base font-bold text-gray-100 md:text-lg">
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
