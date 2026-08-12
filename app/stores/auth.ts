import { defineStore } from "pinia";
import { ref } from "vue";

import { getHttp } from "~/composables/use-api";
import { useStorage } from "~/composables/use-storage";
import { API_ENDPOINTS } from "~/config/constants";
import { useCartStore } from "./cart";

// Cache duration: 5 minutes
const AUTH_CHECK_INTERVAL = 5 * 60 * 1000;
const USER_DATA_KEY = "user_data";

export const useAuthStore = defineStore("auth", () => {
  const http = getHttp();
  const storage = useStorage();
  // State
  const isAuthenticated = ref(false);
  const unAuthorizedError = ref(false);
  const isCheckingAuth = ref(false);
  const lastAuthCheck = ref<number>(0); // Track last check time

  const user = ref<{
    id: number | null;
    email: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
    is_active?: boolean;
    role_id?: number | null;
    last_login_at?: string | null;
    membership?: Record<string, unknown> | null;
    membershipFreeze?: Record<string, unknown> | null;
    passes?: Record<string, unknown> | null;
    profile?: Record<string, unknown> | null;
  }>({
    id: null,
    email: "",
    name: "",
    phoneNumber: "",
    avatar: "",
    membership: null,
    membershipFreeze: null,
    profile: null,
  });

  const permissions = ref<string[]>([]);

  // Load user data from localStorage on store initialization
  const loadUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem(USER_DATA_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        user.value = { ...user.value, ...parsed };
        // If we have stored user data and tokens, assume authenticated
        // (will be verified on next check)
        if (storage.hasTokens()) {
          isAuthenticated.value = true;
        }
      }
    }
    catch {
      // Ignore errors, just proceed without cached data
    }
  };

  // Save user data to localStorage (profile only; permissions are not persisted)
  const saveUserToStorage = () => {
    try {
      localStorage.setItem(
        USER_DATA_KEY,
        JSON.stringify({
          id: user.value.id,
          email: user.value.email,
          name: user.value.name,
          phone: user.value.phoneNumber,
          avatar: user.value.avatar,
          is_active: user.value.is_active,
          role_id: user.value.role_id,
          last_login_at: user.value.last_login_at,
          membership: user.value.membership,
          membershipFreeze: user.value.membershipFreeze,
          passes: user.value.passes,
          profile: user.value.profile,
        }),
      );
    }
    catch {
      // Ignore storage errors
    }
  };

  // Initialize: Load cached user data if available
  loadUserFromStorage();

  // Actions

  const clearAuthData = () => {
    isAuthenticated.value = false;
    user.value = {
      id: null,
      email: "",
      name: "",
      phoneNumber: "",
      avatar: "",
    };
    permissions.value = [];
    try {
      localStorage.removeItem(USER_DATA_KEY);
    }
    catch {
      // Ignore storage errors
    }
  };

  const clearCartItems = () => {
    try {
      const cartStore = useCartStore();
      cartStore.clearCart();
      localStorage.removeItem("cartItems");
    }
    catch {
      // Ignore storage errors
    }
  };

  const clearData = () => {
    clearAuthData();
    clearCartItems();
  };

  const logout = (): void => {
    try {
      storage.removeTokens();
      clearData();
    }
    catch (error: unknown) {
      console.error(error, "Logout Error");
    }
  };

  const checkAuth = async (force = false): Promise<void> => {
    const now = Date.now();

    // Skip if recently checked (unless forced)
    if (!force && now - lastAuthCheck.value < AUTH_CHECK_INTERVAL) {
      return; // Use cached auth state
    }

    // If no tokens, clear auth immediately
    if (!storage.hasTokens()) {
      clearAuthData();
      return;
    }

    isCheckingAuth.value = true;
    try {
      const response = (await http.get(API_ENDPOINTS.AUTH.ME)) as {
        success?: boolean;
        code?: string;
        data?: { user?: Record<string, unknown>; permissions?: string[] };
      };
      const payload = response;
      if (payload) {
        const u = payload as Record<string, unknown>;
        isAuthenticated.value = true;
        user.value.id = (u.id as number) ?? null;
        user.value.email = (u.email as string) ?? "";
        user.value.name = (u.fullName as string) ?? "";
        user.value.phoneNumber = (u.phoneNumber as string) ?? "";
        // user.value.avatar = (u.avatar as string) ?? "";
        // user.value.is_active = u.is_active as boolean | undefined;
        user.value.role_id = (u?.adminRole?.id as number | null) ?? null;
        // user.value.last_login_at = (u.last_login_at as string | null) ?? null;
        user.value.membership
          = (u.membership as Record<string, unknown> | null) ?? null;
        user.value.membershipFreeze
          = (u.membershipFreeze as Record<string, unknown> | null) ?? null;
        user.value.passes
          = (u.passes as Record<string, unknown> | null) ?? null;
        user.value.profile
          = (u.profile as Record<string, unknown> | null) ?? null;
        permissions.value = Array.isArray(u?.permissions) ? u.permissions : [];
        saveUserToStorage();
        lastAuthCheck.value = now;
      }
    }
    catch (error: unknown) {
      console.error(error, "Check Auth Error");
      clearAuthData();
      logout();
    }
    finally {
      isCheckingAuth.value = false;
    }
  };

  const isMembershipFrozen = (): boolean => {
    if (!user.value.membershipFreeze)
      return false;
    const endsOn = user.value.membershipFreeze.endsOn as string;
    if (!endsOn)
      return false;

    const endsOnDate = new Date(endsOn);
    endsOnDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return endsOnDate >= today;
  };

  // Smart check: only checks if needed (cached)
  const checkAuthIfNeeded = async (): Promise<void> => {
    // Always check on first load (no previous check)
    if (lastAuthCheck.value === 0) {
      await checkAuth(true);
      return;
    }

    // Otherwise use cached check
    await checkAuth(false);
  };

  const login = async (payload: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      unAuthorizedError.value = false;
      const { accessToken, refreshToken } = (await http.post(
        API_ENDPOINTS.AUTH.LOGIN,
        { email: payload.email, password: payload.password },
      )) as any;
      if (accessToken && refreshToken) {
        storage.setTokens(accessToken, refreshToken);
        isAuthenticated.value = true;
        // After login, immediately check auth to get user data
        await checkAuth(true);
      }
    }
    catch (error: unknown) {
      console.error(error, "Login Error");
      throw error;
    }
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    password: string;
  }): Promise<void> => {
    try {
      const { accessToken, refreshToken } = (await http.post(
        API_ENDPOINTS.AUTH.REGISTER,
        payload,
      )) as any;
      if (accessToken && refreshToken) {
        storage.setTokens(accessToken, refreshToken);
        isAuthenticated.value = true;
        await checkAuth(true);
      }
    }
    catch (error: unknown) {
      console.error(error, "Register Error");
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase;

    window.location.href = `${baseURL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`;
  };

  const updatePassword = async (payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    try {
      return (await http.patch(
        API_ENDPOINTS.AUTH.UPDATE_PASSWORD,
        payload,
      )) as any;
    }
    catch (error: unknown) {
      console.error(error, "Update Password Error");
      throw error;
    }
  };

  const setUnAuthorizedError = (value: boolean): void => {
    unAuthorizedError.value = value;
  };

  const updateProfile = async (payload: {
    fullName?: string;
    phoneNumber?: string;
    height?: string;
    weight?: string;
    injuryHistory?: string;
    preferences?: string;
  }): Promise<void> => {
    try {
      return (await http.patch(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        payload,
      )) as any;
    }
    catch (error: unknown) {
      console.error(error, "Update Profile Error");
      throw error;
    }
  };

  const forgotPassword = async (payload: { email: string }): Promise<void> => {
    try {
      return (await http.post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        payload,
      )) as any;
    }
    catch (error: unknown) {
      console.error(error, "Forgot Password Error");
      throw error;
    }
  };

  const verifyResetOtp = async (payload: {
    email: string;
    code: string;
  }): Promise<void> => {
    try {
      return (await http.post(API_ENDPOINTS.AUTH.VERIFY_OTP, payload)) as any;
    }
    catch (error: unknown) {
      console.error(error, "Verify OTP Error");
      throw error;
    }
  };

  const resetPassword = async (payload: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<void> => {
    try {
      return (await http.post(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        payload,
      )) as any;
    }
    catch (error: unknown) {
      console.error(error, "Reset Password Error");
      throw error;
    }
  };

  return {
    isAuthenticated,
    isCheckingAuth,
    unAuthorizedError,
    user,
    permissions,
    isMembershipFrozen,
    checkAuth,
    checkAuthIfNeeded,
    login,
    register,
    loginWithGoogle,
    logout,
    updatePassword,
    setUnAuthorizedError,
    updateProfile,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
  };
});
