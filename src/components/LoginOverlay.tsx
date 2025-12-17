import Button from "@/components/Button";
import KakaoLogin from "@/icons/KakaoLogin.png";
import NaverLogin from "@/icons/NaverLogin.png";
import { ENV_VARIABLE } from "@/utils/env-variable";
import type { FC } from "react";
import { useEffect } from "react";

type Props = {
  onClose: () => void;
};

function resolveOAuthUrl(provider: "naver" | "kakao"): string | null {
  if (provider === "naver" && ENV_VARIABLE.NAVER_OAUTH_URL) {
    return ENV_VARIABLE.NAVER_OAUTH_URL;
  }
  if (provider === "kakao" && ENV_VARIABLE.KAKAO_OAUTH_URL) {
    return ENV_VARIABLE.KAKAO_OAUTH_URL;
  }

  return null;
}

const LoginOverlay: FC<Props> = ({ onClose }) => {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

  function handleRedirect(provider: "naver" | "kakao") {
    const url = resolveOAuthUrl(provider);
    if (!url) {
      window.alert("OAuth URL이 설정되지 않았습니다. 환경변수를 확인해주세요.");
      return;
    }
    window.location.assign(url);
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-40 w-[min(90vw,420px)] rounded-4xl bg-plum-800/80 p-6 text-center shadow-xl">
        <h2 className="m-5 text-xl font-bold text-plum-100">로그인</h2>
        <div className="space-y-3">
          <Button
            variant="icon"
            size="sm"
            className="w-full hover:scale-100"
            onClick={() => handleRedirect("naver")}
          >
            <img src={NaverLogin} alt="Naver" />
          </Button>
          <Button
            variant="icon"
            size="sm"
            className="w-full hover:scale-100"
            onClick={() => handleRedirect("kakao")}
          >
            <img src={KakaoLogin} alt="Kakao" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="mt-5" onClick={onClose}>
          취소
        </Button>
      </div>
    </div>
  );
};

export default LoginOverlay;
