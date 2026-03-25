import { ENV } from "./env";

export const API_BASE_URL = ENV.API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    RESEND_VERIFICATION_EMAIL: "/api/v1/auth/resend-verification-email",
    REFRESH: "/api/v1/auth/refresh",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",
    CHANGE_EMAIL: "/api/v1/auth/change-email",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    LOGOUT: "/api/v1/auth/logout",
    CONFIRM_EMAIL_CHANGE: "/api/v1/auth/confirm-email-change",
    ME: "/api/v1/auth/me",
  },
  ONBOARDING: {
    STATUS: "/api/v1/onboarding/status",
    CHOOSE_ROLE: "/api/v1/onboarding/choose-role",
    DOCTOR_PROFILE: "/api/v1/onboarding/doctor-profile",
    DOCUMENTS: "/api/v1/onboarding/documents",
    SUBMIT: "/api/v1/onboarding/submit",
  },
  DOCTORS: {
    LIST: "/api/v1/doctors",
    BY_SLUG: (slug: string) => `/api/v1/doctors/${slug}`,
  },
  EVENTS: {
    LIST: "/api/v1/events",
    BY_SLUG: (slug: string) => `/api/v1/events/${slug}`,
    REGISTER: (id: string) => `/api/v1/events/${id}/register`,
    CONFIRM_GUEST: (id: string) => `/api/v1/events/${id}/confirm-guest-registration`,
  },
  ARTICLES: {
    LIST: "/api/v1/articles",
    BY_SLUG: (slug: string) => `/api/v1/articles/${slug}`,
  },
  ARTICLE_THEMES: "/api/v1/article-themes",
  DOCUMENTS: {
    LIST: "/api/v1/organization-documents",
    BY_SLUG: (slug: string) => `/api/v1/organization-documents/${slug}`,
  },
  CITIES: "/api/v1/cities",
  CITY_BY_SLUG: (slug: string) => `/api/v1/cities/${slug}`,
  PROFILE: {
    PERSONAL: "/api/v1/profile/personal",
    PUBLIC: "/api/v1/profile/public",
    PUBLIC_SUBMIT: "/api/v1/profile/public/submit",
    PHOTO: "/api/v1/profile/photo",
    EVENTS: "/api/v1/profile/events",
    DIPLOMA_PHOTO: "/api/v1/profile/diploma-photo",
  },
  SUBSCRIPTIONS: {
    STATUS: "/api/v1/subscriptions/status",
    PAY: "/api/v1/subscriptions/pay",
    PAY_ARREARS: "/api/v1/subscriptions/pay-arrears",
    PAYMENTS: "/api/v1/subscriptions/payments",
    RECEIPT: (id: string) => `/api/v1/subscriptions/payments/${id}/receipt`,
    PAYMENT_STATUS: (id: string) =>
      `/api/v1/subscriptions/payments/${id}/status`,
    PAYMENT_CHECK_STATUS: (id: string) =>
      `/api/v1/subscriptions/payments/${id}/check-status`,
  },
  COLLEAGUES: "/api/v1/colleagues",
  CERTIFICATES: {
    LIST: "/api/v1/certificates",
    DOWNLOAD: (id: string) => `/api/v1/certificates/${id}/download`,
    PUBLIC_VERIFY: (number: string) =>
      `/api/v1/public/certificates/verify/${encodeURIComponent(number)}`,
  },
  TELEGRAM: {
    BINDING: "/api/v1/telegram/binding",
    GENERATE_CODE: "/api/v1/telegram/generate-code",
  },
  VOTING: {
    ACTIVE: "/api/v1/voting/active",
    VOTE: (id: string) => `/api/v1/voting/${id}/vote`,
  },
  SEO: (slug: string) => `/api/v1/seo/${slug}`,
  SETTINGS_PUBLIC: "/api/v1/settings/public",
} as const;
