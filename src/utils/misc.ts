import { type Optional } from "@/types/misc";

export function safelyGet<TValue>(callback: () => TValue): Optional<TValue> {
  try {
    return callback();
  } catch {
    return undefined;
  }
}
