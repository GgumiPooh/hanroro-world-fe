export const ENV_VARIABLE = {
  IS_COMMING_SOON:
    import.meta.env.VITE_IS_COMMING_SOON === "true" ? true : false,
} as const;
