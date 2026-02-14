const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const ENV_VARIABLE = {
  IS_COMING_SOON: import.meta.env.VITE_IS_COMING_SOON === "true",
  API_BASE_URL: API_BASE,
  NAVER_OAUTH_URL:
    import.meta.env.VITE_NAVER_OAUTH_URL ??
    `${API_BASE}/oauth2/authorization/naver`,
  KAKAO_OAUTH_URL:
    import.meta.env.VITE_KAKAO_OAUTH_URL ??
    `${API_BASE}/oauth2/authorization/kakao`,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
} as const;
