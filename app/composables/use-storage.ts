/**
 * Remembered auth tokens use cookies; temporary sessions use sessionStorage.
 * HttpOnly cookies must be issued by the API; client code cannot create them.
 */
const COOKIE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  REMEMBER_ME: "rememberMe",
} as const;

const PENDING_REMEMBER_ME_KEY = "pendingRememberMe";
const USER_DATA_KEY = "user_data";

export type TokenLifetimes = {
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
};

function readCookie(name: string): string | null {
  if (!import.meta.client)
    return null;
  const item = document.cookie
    .split(";")
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

function expiryFromSeconds(expiresIn?: number): Date | null {
  if (typeof expiresIn !== "number" || !Number.isFinite(expiresIn) || expiresIn <= 0)
    return null;
  return new Date(Date.now() + expiresIn * 1000);
}

function writeCookie(name: string, value: string, expiresIn?: number): void {
  if (!import.meta.client)
    return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const expiry = expiryFromSeconds(expiresIn);
  const expires = expiry ? `; Expires=${expiry.toUTCString()}` : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax${expires}${secure}`;
}

function removeCookie(name: string): void {
  if (!import.meta.client)
    return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

function getToken(name: string, legacyKey: string): string | null {
  if (import.meta.client) {
    const sessionValue = sessionStorage.getItem(name);
    if (sessionValue)
      return sessionValue;
  }

  const cookieValue = readCookie(name);
  if (cookieValue)
    return cookieValue;

  // One-time migration for users with an existing localStorage session.
  if (!import.meta.client)
    return null;
  const legacyValue = localStorage.getItem(legacyKey);
  if (legacyValue) {
    sessionStorage.setItem(name, legacyValue);
    localStorage.removeItem(legacyKey);
  }
  return legacyValue;
}

export function useStorage() {
  const isRemembered = () => readCookie(COOKIE_KEYS.REMEMBER_ME) === "true"
    || (import.meta.client && sessionStorage.getItem(COOKIE_KEYS.REMEMBER_ME) === "true");

  // Keeps the "Remember me" choice across the external Google OAuth redirect.
  const setPendingRememberMe = (rememberMe: boolean): void => {
    if (!import.meta.client)
      return;
    sessionStorage.setItem(PENDING_REMEMBER_ME_KEY, String(rememberMe));
  };

  const consumePendingRememberMe = (): boolean => {
    if (!import.meta.client)
      return false;
    const value = sessionStorage.getItem(PENDING_REMEMBER_ME_KEY);
    sessionStorage.removeItem(PENDING_REMEMBER_ME_KEY);
    return value === "true";
  };

  const getAccessToken = () => getToken(COOKIE_KEYS.ACCESS_TOKEN, "accessToken");
  const getRefreshToken = () => getToken(COOKIE_KEYS.REFRESH_TOKEN, "refreshToken");

  const setTokens = (
    accessToken: string,
    refreshToken: string,
    rememberMe = false,
    lifetimes: TokenLifetimes = {},
  ): boolean => {
    // Clear any credentials from the other storage mode before switching.
    removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
    removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
    if (import.meta.client) {
      sessionStorage.removeItem(COOKIE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(COOKIE_KEYS.REFRESH_TOKEN);
    }
    if (rememberMe) {
      writeCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken, lifetimes.accessTokenExpiresIn);
      writeCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, lifetimes.refreshTokenExpiresIn);
      writeCookie(COOKIE_KEYS.REMEMBER_ME, "true", lifetimes.refreshTokenExpiresIn);
      if (import.meta.client) {
        sessionStorage.removeItem(USER_DATA_KEY);
      }
    }
    else {
      removeCookie(COOKIE_KEYS.REMEMBER_ME);
      if (import.meta.client) {
        sessionStorage.setItem(COOKIE_KEYS.ACCESS_TOKEN, accessToken);
        sessionStorage.setItem(COOKIE_KEYS.REFRESH_TOKEN, refreshToken);
        sessionStorage.setItem(COOKIE_KEYS.REMEMBER_ME, "false");
        localStorage.removeItem(USER_DATA_KEY);
      }
    }
    return true;
  };

  const getUserData = <T = Record<string, unknown>>(): T | null => {
    if (!import.meta.client)
      return null;
    const raw = sessionStorage.getItem(USER_DATA_KEY)
      ?? (isRemembered() ? localStorage.getItem(USER_DATA_KEY) : null);
    if (!raw)
      return null;
    try {
      return JSON.parse(raw) as T;
    }
    catch {
      return null;
    }
  };

  const setUserData = (data: unknown): void => {
    if (!import.meta.client)
      return;
    const serialized = JSON.stringify(data);
    if (isRemembered()) {
      localStorage.setItem(USER_DATA_KEY, serialized);
      sessionStorage.removeItem(USER_DATA_KEY);
    }
    else {
      sessionStorage.setItem(USER_DATA_KEY, serialized);
      localStorage.removeItem(USER_DATA_KEY);
    }
  };

  const removeUserData = (): void => {
    if (!import.meta.client)
      return;
    sessionStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  };

  const setAccessToken = (accessToken: string, expiresIn?: number): void => {
    if (isRemembered())
      writeCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken, expiresIn);
    else if (import.meta.client)
      sessionStorage.setItem(COOKIE_KEYS.ACCESS_TOKEN, accessToken);
  };

  const setRefreshToken = (
    refreshToken: string,
    expiresIn?: number,
    rememberMe = false,
  ): void => {
    if (rememberMe) {
      writeCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, expiresIn);
      writeCookie(COOKIE_KEYS.REMEMBER_ME, "true", expiresIn);
    }
    else if (import.meta.client) {
      sessionStorage.setItem(COOKIE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  };

  const removeTokens = (): boolean => {
    removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
    removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
    removeCookie(COOKIE_KEYS.REMEMBER_ME);
    if (import.meta.client) {
      sessionStorage.removeItem(COOKIE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(COOKIE_KEYS.REFRESH_TOKEN);
      sessionStorage.removeItem(COOKIE_KEYS.REMEMBER_ME);
      sessionStorage.removeItem(PENDING_REMEMBER_ME_KEY);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    return true;
  };

  return {
    getAccessToken,
    getRefreshToken,
    setTokens,
    setAccessToken,
    setRefreshToken,
    removeTokens,
    getUserData,
    setUserData,
    removeUserData,
    hasTokens: () => Boolean(getAccessToken() && getRefreshToken()),
    hasRefreshToken: () => Boolean(getRefreshToken()),
    isRemembered,
    setPendingRememberMe,
    consumePendingRememberMe,
  };
}
