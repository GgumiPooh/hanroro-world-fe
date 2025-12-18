export const ENV_VARIABLE = {
  IS_COMMING_SOON:
    import.meta.env.VITE_IS_COMMING_SOON === "true" ? true : false,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "",
  NAVER_OAUTH_URL: import.meta.env.VITE_NAVER_OAUTH_URL,
  KAKAO_OAUTH_URL: import.meta.env.VITE_KAKAO_OAUTH_URL,
} as const;
