export const PUBLIC_PATHS = [
  "/",
  "/doctors",
  "/events",
  "/articles",
  "/faq",
  "/documents",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm-email",
  "/auth/verify-email",
  "/pravlenie",
  "/payment/success",
  "/payment/fail",
] as const;

export const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm-email",
] as const;

export const PUBLIC_DYNAMIC_PREFIXES = [
  "/doctors/",
  "/events/",
  "/articles/",
  "/documents/",
  "/certificates/",
] as const;
