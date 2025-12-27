export const ENV_VARIABLE = {
  IS_COMMING_SOON:
    import.meta.env.VITE_IS_COMMING_SOON === "true" ? true : false,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  NAVER_OAUTH_URL: import.meta.env.VITE_NAVER_OAUTH_URL,
  KAKAO_OAUTH_URL: import.meta.env.VITE_KAKAO_OAUTH_URL,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
} as const;
