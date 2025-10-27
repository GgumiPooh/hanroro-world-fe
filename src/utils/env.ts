export function isBrowser() {
  return typeof window === "object";
}

export function isMobile(): boolean {
  return isBrowser() && isMobileUA(navigator.userAgent);
}

export function isMobileUA(userAgent: string): boolean {
  return /Mobi|Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|FB_IAB|FBAN|FBAV/i.test(
    userAgent,
  );
}
