import Button from "@/components/Button";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { createPortal } from "react-dom";
import { useEvent } from "react-use";

type Props = {
  currentNickname?: string | null;
  onClose: () => void;
};

const NicknameChangeOverlay: FC<Props> = ({ currentNickname, onClose }) => {
  const [nickname, setNickname] = useState(currentNickname ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEvent("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    onClose();
  });

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-40 w-[min(90vw,420px)] rounded-4xl bg-gray-800/70 p-12 shadow-xl">
        <h2 className="mb-6 text-center text-xl text-plum-100">닉네임 변경</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-plum-300"></label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="새 닉네임을 입력하세요"
              className="w-full rounded-xl border border-plum-600/30 bg-plum-900/30 px-4 py-3 text-plum-100 transition-colors duration-200 placeholder:text-plum-400/60 hover:border-plum-300 focus:border-plum-500 focus:outline-none"
              maxLength={20}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="text-center text-sm text-plum-400">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              size="md"
              className="flex-1 border border-gray-400"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting || !nickname.trim()}
            >
              {isSubmitting ? "변경 중..." : "변경하기"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );

  async function handleSubmit() {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    if (nickname.trim().length < 2) {
      setError("닉네임은 2자 이상이어야 합니다.");
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
        setError("닉네임은 2자 이상이어야 합니다.");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to update nickname");
      }

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
