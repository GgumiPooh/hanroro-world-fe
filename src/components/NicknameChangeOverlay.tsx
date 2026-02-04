import Button from "@/components/Button";
import type { Nullable } from "@/types/misc";
import { assert } from "@/utils/assert";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { cn } from "@/utils/styles";
import { Portal } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { useEvent } from "react-use";

const MIN_NICKNAME_LENGTH = 2;
const MAX_NICKNAME_LENGTH = 20;

type Props = {
  className?: string;
  currentNickname?: Nullable<string>;
  onClose: () => void;
};

const NicknameChangeOverlay: FC<Props> = ({
  className,
  currentNickname,
  onClose,
}) => {
  const [nickname, setNickname] = useState(currentNickname ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);
  const queryClient = useQueryClient();

  useEvent("keydown", (e) => e.key === "Escape" && onClose());

  return (
    <Portal>
      <div className={cn("fixed inset-0 z-50", className)}>
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="relative mx-auto mt-40 w-[min(90vw,420px)] rounded-4xl bg-gray-800/70 p-12 shadow-xl">
          <h2 className="mb-6 text-center text-xl text-plum-100">닉네임 변경</h2>

          <div className="space-y-4">
            <div>
              <input
                className="w-full rounded-xl border border-plum-600/30 bg-plum-900/30 px-4 py-3 text-plum-100 transition-colors duration-200 placeholder:text-plum-400/60 hover:border-plum-300 focus:border-plum-500 focus:outline-none"
                type="text"
                value={nickname}
                placeholder="새 닉네임을 입력하세요"
                maxLength={MAX_NICKNAME_LENGTH}
                disabled={isSubmitting}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && (
              <p className="text-center text-sm text-plum-400">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 border border-gray-400"
                variant="ghost"
                size="md"
                disabled={isSubmitting}
                onClick={onClose}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                variant="primary"
                size="md"
                disabled={isSubmitting || !nickname.trim()}
                onClick={handleSubmit}
              >
                {isSubmitting ? "변경 중..." : "변경하기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );

  async function handleSubmit() {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    if (nickname.trim().length < MIN_NICKNAME_LENGTH) {
      setError(`닉네임은 ${MIN_NICKNAME_LENGTH}자 이상이어야 합니다.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `${ENV_VARIABLE.API_BASE_URL}/api/auth/nickname`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nickname: nickname.trim() }),
        },
      );

      if (res.status === 409) {
        setError("이미 사용 중인 닉네임입니다.");
        return;
      }
      if (res.status === 400) {
        setError(`닉네임은 ${MIN_NICKNAME_LENGTH}자 이상이어야 합니다.`);
        return;
      }
      assert(res.ok, "Failed to update nickname");

      await queryClient.refetchQueries({ queryKey: ["currentUser"] });
      onClose();
    } catch (err) {
      console.error("Nickname update failed:", err);
      setError("닉네임 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }
};

export default NicknameChangeOverlay;
