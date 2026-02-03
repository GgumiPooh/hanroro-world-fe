import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import type { Activity } from "@/types/activity";
import type { Sort } from "@/types/sort";
import { cn } from "@/utils/styles";
import { CheckCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";

function selectLocalizedTitle(
  titles: { language: string; content: string }[],
  targetLanguage = "kor",
): string {
  const matched = titles.find((item) => item.language === targetLanguage);
  return matched ? matched.content : (titles[0]?.content ?? "");
}

function findMetadataUrl(
  metadata: { type: string; url: string }[],
  targetType: string,
): string {
  const matched = metadata.find((item) => item.type === targetType);
  return matched ? matched.url : (metadata[0]?.url ?? "");
}

function isLocalDateFormat(value: string): boolean {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function padZero(num: number): string {
  return num < 10 ? `0${num}` : String(num);
}

function getTodayDateString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;
}

function isDateInPast(dateValue: string): boolean {
  if (!dateValue) return false;
  if (isLocalDateFormat(dateValue)) {
    return dateValue < getTodayDateString();
  }
  const timestamp = Date.parse(dateValue);
  return Number.isFinite(timestamp) ? timestamp < Date.now() : false;
}

function formatDateString(dateValue: string): string {
  if (!dateValue) return "";
  if (isLocalDateFormat(dateValue)) {
    return dateValue.replaceAll("-", ".");
  }
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()}`;
}

type Props = {
  className?: string;
  activity: Activity;
  index: number;
  sort: Sort;
};

const ActivityCard: FC<Props> = ({ className, activity, index, sort }) => {
  return (
    <li
      className={cn("flex w-full items-center", className)}
      key={`${index}-${sort}`}
    >
      <div className="relative top-2/5 left-[-15px] h-6 w-6 rounded-2xl bg-gray-500/90 md:left-[-19px] md:h-8 md:w-8">
        <CheckCircleIcon
          className={cn(
            "size-6 md:size-8",
            isDateInPast(activity.activeTo)
              ? "text-plum-300"
              : "text-gray-500/50",
          )}
        />
      </div>
      <div className="ml-3 flex flex-row md:ml-30">
        <div className="mr-5 w-30 shrink-0 md:mr-10 md:w-45">
          <ImageWithPlaceholder
            src={findMetadataUrl(activity.metaData, "img")}
            alt="img"
            className="h-auto w-full rounded-lg shadow-[0_13px_25px_rgba(97,120,150,0.4)]"
          />
        </div>
        <div className="mr-5 h-auto border-l-3 border-gray-600/40 pl-5">
          <h1 className="text-lg font-bold text-plum-300">
            {formatDateString(activity.activeFrom)}
          </h1>
          <h1 className="mb-5 text-base font-bold text-gray-100 md:text-lg">
            {selectLocalizedTitle(activity.title, "kor")}
          </h1>
          <ExternalLink href={findMetadataUrl(activity.metaData, "video")}>
            <Button variant="secondary" size="sm">
              <VideoCameraIcon className="size-4" />
            </Button>
          </ExternalLink>
        </div>
      </div>
    </li>
  );
};

export default ActivityCard;
