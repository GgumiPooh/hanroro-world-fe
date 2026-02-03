import Button from "@/components/Button";
import type { Nullable } from "@/types/misc";
import { ENV_VARIABLE } from "@/utils/env-variable";
import type { FC } from "react";
import { useNavigate } from "react-router";
import { useEvent } from "react-use";

const Login: FC = () => {
  const navigate = useNavigate();

  useEvent("keydown", (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      navigate(-1);
    }
  });

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={handleNavigateBack}
      />

      <div className="relative mx-auto mt-40 w-[min(90vw,420px)] rounded-4xl bg-plum-800/80 p-6 text-center shadow-xl">
        <h2 className="mb-5 text-xl font-bold text-plum-100">Sign in</h2>
        <p className="mb-6 text-sm text-plum-200/80">
          Choose a provider to continue
        </p>

        <div className="space-y-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => handleRedirect("naver")}
          >
            Continue with Naver
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => handleRedirect("kakao")}
          >
            Continue with Kakao
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-5"
          onClick={handleNavigateBack}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  function handleNavigateBack() {
    navigate(-1);
  }

  function handleRedirect(provider: "naver" | "kakao") {
    const url = resolveOAuthUrl(provider);
    if (!url) {
      window.alert("OAuth URL이 설정되지 않았습니다. 환경변수를 확인해주세요.");
      return;
    }
    window.location.assign(url);
  }
};

export default Login;

function resolveOAuthUrl(provider: "naver" | "kakao"): Nullable<string> {
  if (provider === "naver" && ENV_VARIABLE.NAVER_OAUTH_URL) {
    return ENV_VARIABLE.NAVER_OAUTH_URL;
  }
  if (provider === "kakao" && ENV_VARIABLE.KAKAO_OAUTH_URL) {
    return ENV_VARIABLE.KAKAO_OAUTH_URL;
  }
  if (ENV_VARIABLE.API_BASE_URL) {
    return `${ENV_VARIABLE.API_BASE_URL}/oauth2.0/authorization/${provider}`;
  }
  return null;
}
