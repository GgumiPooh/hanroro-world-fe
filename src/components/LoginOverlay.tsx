import Button from "@/components/Button";
import type { Nullable } from "@/types/misc";
import { ENV_VARIABLE } from "@/utils/env-variable";
import type { FC } from "react";
import { useEvent } from "react-use";

type Props = {
  onClose: () => void;
};

const LoginOverlay: FC<Props> = ({ onClose }) => {
  useEvent("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative mx-auto mt-40 w-[min(90vw,420px)] rounded-4xl bg-gray-800/80 p-10 text-center shadow-xl">
        <h2 className="mb-10 text-xl font-bold text-plum-300">로그인</h2>
        <div className="space-y-3">
          <Button
            variant="icon"
            size="sm"
            className="w-full hover:scale-100"
            onClick={() => handleRedirect("naver")}
          >
            <img src="/images/naver-login.png" alt="Naver" />
          </Button>
          <Button
            variant="icon"
            size="sm"
            className="w-full hover:scale-100"
            onClick={() => handleRedirect("kakao")}
          >
            <img src="/images/kakao-login.png" alt="Kakao" />
          </Button>
        </div>
        <Button variant="ghost" size="md" className="mt-5" onClick={onClose}>
          취소
        </Button>
      </div>
    </div>
  );

  function handleRedirect(provider: "naver" | "kakao") {
    const redirectUrl = getOAuthRedirectUrl(provider);
    if (!redirectUrl) {
      window.alert("OAuth URL이 설정되지 않았습니다. 환경변수를 확인해주세요.");
      return;
    }
    window.location.assign(redirectUrl);
  }
};

export default LoginOverlay;

function getOAuthRedirectUrl(provider: "naver" | "kakao"): Nullable<string> {
  if (provider === "naver" && ENV_VARIABLE.NAVER_OAUTH_URL) {
    return ENV_VARIABLE.NAVER_OAUTH_URL;
  }
  if (provider === "kakao" && ENV_VARIABLE.KAKAO_OAUTH_URL) {
    return ENV_VARIABLE.KAKAO_OAUTH_URL;
  }

  return null;
}
