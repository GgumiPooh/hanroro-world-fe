import Button from "@/components/Button";
import { assert } from "@/utils/assert";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { cn } from "@/utils/styles";
import { Portal } from "@headlessui/react";
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
    // 먼저 localStorage 정리
    localStorage.removeItem("currentUser");

    try {
      await fetch(`${ENV_VARIABLE.API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      window.location.reload();
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

      localStorage.removeItem("currentUser"); // 캐시 정리
      localStorage.removeItem("privacyConsent");
      window.location.reload();
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
