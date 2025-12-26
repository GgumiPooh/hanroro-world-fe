import Button from "@/components/Button";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type FC } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
  onNicknameChange: () => void;
};

const UserMenuOverlay: FC<Props> = ({ onClose, onNicknameChange }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

  const handleLogout = async () => {
    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
      queryClient.clear();
      window.location.href = "/";
    }
  };

  const handleNicknameChange = () => {
    onClose();
    onNicknameChange();
  };

  const handleDeleteAccount = async () => {
    // 확인 다이얼로그
    const confirmed = window.confirm(
      "정말 회원탈퇴 하시겠습니까?\n\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.",
    );
    if (!confirmed) return;

    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(`${baseUrl}/api/auth/delete`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("회원 탈퇴 실패");
      }
      // 캐시 삭제
      localStorage.removeItem("privacyConsent");
      queryClient.clear(); // React Query 캐시 삭제
      window.location.reload();
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
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
            variant="icon"
            size="md"
            className="w-full py-3 text-plum-200 md:text-xl"
            onClick={handleNicknameChange}
          >
            닉네임 변경
          </Button>
          <Button
            variant="icon"
            size="md"
            className="w-full py-3 text-plum-200 md:text-xl"
            onClick={handleLogout}
          >
            지수와로그아웃
          </Button>
          <Button
            variant="icon"
            size="md"
            className="w-full py-3 text-xl text-plum-600"
            onClick={handleDeleteAccount}
          >
            회원 탈퇴
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default UserMenuOverlay;
