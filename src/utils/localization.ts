import type { LanguageData } from "@/types/common";
import type { Optional } from "@/types/misc";

export function selectLocalizedText(
  items: string | Optional<LanguageData[]>,
  preferredLanguages: string[] = ["ko", "en"],
): string {
  if (!items) return "";
  if (typeof items === "string") return items;
  if (items.length === 0) return "";

  const matchedContent = preferredLanguages
    .map((language) =>
      items.find((item) => item.language?.toLowerCase() === language),
    )
    .find((matched) => matched?.content)?.content;

  return matchedContent ?? items[0]?.content ?? "";
}
