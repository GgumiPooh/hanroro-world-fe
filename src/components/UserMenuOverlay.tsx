import Button from "@/components/Button";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { useEffect, type FC } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
  onNicknameChange: () => void;
};

const UserMenuOverlay: FC<Props> = ({ onClose, onNicknameChange }) => {
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
    } finally {
      window.location.href = "/";
    }
  };

  const handleNicknameChange = () => {
    onClose();
    onNicknameChange();
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-40 w-[min(90vw,280px)] rounded-4xl bg-plum-800/90 py-1 shadow-xl">
        <h2 className="mb-5 border-b border-plum-400 py-3 text-center text-xl font-bold text-plum-100">
          메뉴
        </h2>

        <div className="mb-3">
          <Button
            variant="icon"
            size="md"
            className="w-full py-3 text-plum-200"
            onClick={handleNicknameChange}
          >
            닉네임 변경
          </Button>
          <Button
            variant="icon"
            size="md"
            className="w-full py-3 text-plum-200"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default UserMenuOverlay;
