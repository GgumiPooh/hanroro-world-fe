import Button from "@/components/Button";
import ImageWithPlaceholder from "@/components/ImageWithPlaceholder";
import type { Nullable } from "@/types/misc";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { cn } from "@/utils/styles";
import { Portal } from "@headlessui/react";
import type { FC } from "react";
import { useEvent } from "react-use";

type Props = {
  className?: string;
  onClose: () => void;
};

const LoginOverlay: FC<Props> = ({ className, onClose }) => {
  useEvent("keydown", (e: KeyboardEvent) => e.key === "Escape" && onClose());

  return (
    <Portal>
      <div className={cn("fixed inset-0 z-[100]", className)}>
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="relative mx-auto mt-40 w-[min(90vw,420px)] rounded-4xl bg-gray-800/80 p-10 text-center shadow-xl">
          <h2 className="mb-10 text-xl font-bold text-plum-300">로그인</h2>
          <div className="space-y-3">
            <Button
              className="w-full hover:scale-100"
              variant="icon"
              size="sm"
              onClick={handleRedirect("naver")}
            >
              <ImageWithPlaceholder
                className="w-full"
                src="/images/naver-login.png"
                alt="Naver"
              />
            </Button>
            <Button
              className="w-full hover:scale-100"
              variant="icon"
              size="sm"
              onClick={handleRedirect("kakao")}
            >
              <ImageWithPlaceholder
                className="w-full"
                src="/images/kakao-login.png"
                alt="Kakao"
              />
            </Button>
          </div>
          <Button className="mt-5" variant="ghost" size="md" onClick={onClose}>
            취소
          </Button>
        </div>
      </div>
    </Portal>
  );

  function handleRedirect(provider: "naver" | "kakao") {
    return () => {
      const redirectUrl = getOAuthRedirectUrl(provider);
      if (!redirectUrl) {
        window.alert(
          "OAuth URL이 설정되지 않았습니다. 환경변수를 확인해주세요.",
        );
        return;
      }
      window.location.assign(redirectUrl);
    };
  }
};

function getOAuthRedirectUrl(provider: "naver" | "kakao"): Nullable<string> {
  if (provider === "naver" && ENV_VARIABLE.NAVER_OAUTH_URL) {
    return ENV_VARIABLE.NAVER_OAUTH_URL;
  }
  if (provider === "kakao" && ENV_VARIABLE.KAKAO_OAUTH_URL) {
    return ENV_VARIABLE.KAKAO_OAUTH_URL;
  }

  return null;
}

export default LoginOverlay;
