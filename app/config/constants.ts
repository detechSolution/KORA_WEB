export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_LOGIN: "/api/v1/auth/member/google/login",
    LOGIN: "/api/v1/auth/member/login",
    LOGOUT: "/api/v1/auth/member/logout",
    REGISTER: "/api/v1/auth/member/register",
    ME: "/api/v1/auth/me",
    REFRESH: "/api/v1/auth/member/refresh",
    UPDATE_PASSWORD: "/api/v1/auth/update-password",
    UPDATE_PROFILE: "/api/v1/auth/update-profile",
    FORGOT_PASSWORD: "/api/v1/password-reset/forgot-password",
    VERIFY_OTP: "/api/v1/password-reset/verify-code",
    RESET_PASSWORD: "/api/v1/password-reset/reset-password",
  },

  SESSION: {
    GET: "/api/v1/sessions/website",
  },

  INQUIRE: {
    CREATE: "/api/v1/mails/inquiries",
  },

  MEMBERSHIP: {
    GET: "/api/v1/membership-plans/website",
  },

  PASS: {
    GET: "/api/v1/passes/website",
  },
};
