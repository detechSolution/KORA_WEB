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
    REQUEST_CANCELLATION: (bookingId: number) =>
      `/api/v1/members/me/bookings/${bookingId}/request-cancellation`,
  },

  SESSION: {
    GET: "/api/v1/sessions/website",
    REMAINING_GUEST: "/api/v1/sessions/remaining-guest",
    WAITLIST: (id: number) => `/api/v1/sessions/${id}/waitlist`,
  },

  INQUIRE: {
    CREATE: "/api/v1/mails/inquiries",
    CREATE_CORPORATE: "/api/v1/mails/kora-corporate",
  },

  SPA: {
    GET: "/api/v1/spa/website",
    TIME_AVAILABILITY: "/api/v1/bookings/website/spa-time-availability",
  },

  MEMBERSHIP: {
    GET: "/api/v1/membership-plans/website",
  },

  PASS: {
    GET: "/api/v1/passes/website",
  },

  PROMO_CODE: {
    VALIDATE: "/api/v1/promo-codes/validate",
  },

  PAYMENT: {
    PAY_NOW: "/api/v1/commerce/checkout/pay-now",
    VERIFY: "/api/v1/commerce/payments/verify",
    FONEPAY_STATUS: "/api/v1/commerce/checkout/fonepay/status",
  },

  MEMBER: {
    DASHBOARD: "/api/v1/members/me/dashboard",
    BOOKINGS: "/api/v1/members/me/bookings",
  },
  NEWSLETTER: {
    CREATE: "/api/v1/mails/newsletter-signups",
  },
};
