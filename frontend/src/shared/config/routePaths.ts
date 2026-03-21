export const PUBLIC_PATHS = [
  "/",
  "/doctors",
  "/events",
  "/articles",
  "/documents",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm-email",
  "/auth/verify-email",
  "/themes",
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
