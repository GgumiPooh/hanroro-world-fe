import Button from "@/components/Button";
import { assert } from "@/utils/assert";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { cn } from "@/utils/styles";
import { Portal } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { useEvent } from "react-use";

type Props = {
  className?: string;
  onClose: () => void;
  onNicknameMenuClick: () => void;
};

const UserMenuOverlay: FC<Props> = ({
  className,
  onClose,
  onNicknameMenuClick,
}) => {
  const queryClient = useQueryClient();
  useEvent("keydown", (e) => e.key === "Escape" && onClose());

  return (
    <Portal>
      <div className={cn("fixed inset-0 z-50", className)}>
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="relative mx-auto mt-40 w-[min(90vw,280px)] rounded-4xl bg-gray-800/70 py-5 shadow-xl">
          <h2 className="mb-5 border-b border-gray-400 py-3 text-center text-xl font-bold text-plum-100">
            메뉴
          </h2>

          <div className="mb-3 space-y-3">
            <Button
              className="w-full py-3 text-plum-200 md:text-xl"
              variant="icon"
              size="md"
              onClick={handleNicknameMenuClick}
            >
              닉네임 변경
            </Button>
            <Button
              className="w-full py-3 text-plum-200 md:text-xl"
              variant="icon"
              size="md"
              onClick={handleLogout}
            >
              지수와로그아웃
            </Button>
            <Button
              className="w-full py-3 text-xl text-plum-600"
              variant="icon"
              size="md"
              onClick={handleDeleteAccount}
            >
              회원 탈퇴
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );

  async function handleLogout() {
    // 즉시 UI 반영: localStorage + React Query 캐시 클리어 → 헤더가 바로 "Log In"으로 전환
    localStorage.removeItem("currentUser");
    queryClient.setQueryData(["currentUser"], null);

    // 서버 쿠키 삭제 완료 후 오버레이 닫기 (쿠키 남아있는 상태에서 API 호출 방지)
    try {
      await fetch(`${ENV_VARIABLE.API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      alert("로그아웃이 완료되었습니다.");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      onClose();
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "정말 회원탈퇴 하시겠습니까?\n\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.",
    );
    if (!confirmed) {
      return;
    }

    try {
      const res = await fetch(`${ENV_VARIABLE.API_BASE_URL}/api/auth/delete`, {
        method: "DELETE",
        credentials: "include",
      });
      assert(res.ok, "회원 탈퇴 실패");

      localStorage.removeItem("currentUser");
      localStorage.removeItem("privacyConsent");
      queryClient.setQueryData(["currentUser"], null);
      onClose();
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
  }

  function handleNicknameMenuClick() {
    onClose();
    onNicknameMenuClick();
  }
};

export default UserMenuOverlay;
