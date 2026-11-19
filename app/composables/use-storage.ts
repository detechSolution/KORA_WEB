/**
 * Browser cookie storage for authentication tokens.
 * Access and refresh tokens are intentionally not persisted in localStorage.
 * HttpOnly cookies must be issued by the API; client code cannot create them.
 */
const COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  REMEMBER_ME: "rememberMe",
} as const;

const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;

function readCookie(name: string): string | null {
  if (!import.meta.client)
    return null;
  const item = document.cookie
    .split(";")
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

function writeCookie(name: string, value: string, persistent: boolean): void {
  if (!import.meta.client)
    return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const maxAge = persistent ? `; Max-Age=${REMEMBER_ME_MAX_AGE}` : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${maxAge}${secure}`;
}

function removeCookie(name: string): void {
  if (!import.meta.client)
    return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

function getToken(name: string, legacyKey: string): string | null {
  const cookieValue = readCookie(name);
  if (cookieValue)
    return cookieValue;

  // One-time migration for users with an existing localStorage session.
  if (!import.meta.client)
    return null;
  const legacyValue = localStorage.getItem(legacyKey);
  if (legacyValue) {
    writeCookie(name, legacyValue, false);
    localStorage.removeItem(legacyKey);
  }
  return legacyValue;
}

export function useStorage() {
  const isRemembered = () => readCookie(COOKIE_KEYS.REMEMBER_ME) === "true";

  const getAccessToken = () => getToken(COOKIE_KEYS.ACCESS_TOKEN, "accessToken");
  const getRefreshToken = () => getToken(COOKIE_KEYS.REFRESH_TOKEN, "refreshToken");

  const setTokens = (accessToken: string, refreshToken: string, rememberMe = false): boolean => {
    writeCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken, rememberMe);
    writeCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, rememberMe);
    if (rememberMe)
      writeCookie(COOKIE_KEYS.REMEMBER_ME, "true", true);
    else
      removeCookie(COOKIE_KEYS.REMEMBER_ME);
    return true;
  };

  const removeTokens = (): boolean => {
    removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
    removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
    removeCookie(COOKIE_KEYS.REMEMBER_ME);
    if (import.meta.client) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    return true;
  };

  return {
    getAccessToken,
    getRefreshToken,
    setTokens,
    removeTokens,
    hasTokens: () => Boolean(getAccessToken() && getRefreshToken()),
    isRemembered,
  };
}
