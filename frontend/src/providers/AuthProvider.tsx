"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { authApi } from "@/entities/auth";
import type { OnboardingStatus, OnboardingNextStep } from "@/entities/auth";
import { ROUTES } from "@/shared/config";

export interface SessionUser {
  onboarding: OnboardingStatus;
  email?: string;
}

function getEmailFromToken(token: string): string | undefined {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded.email ?? decoded.sub;
  } catch {
    return undefined;
  }
}

interface AuthContextType {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<OnboardingStatus>;
  logout: () => void;
}

const SESSION_COOKIE = "has_session";

function setSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Strict`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

const NEXT_STEP_ROUTES: Partial<Record<OnboardingNextStep, string>> = {
  choose_role: ROUTES.ONBOARDING_ROLE,
  fill_profile: ROUTES.ONBOARDING_PROFILE,
  upload_documents: ROUTES.ONBOARDING_PROFILE,
  submit: ROUTES.ONBOARDING_PROFILE,
  await_moderation: ROUTES.ONBOARDING_PENDING,
  pay_entry_fee: ROUTES.CABINET_PAYMENTS,
  completed: ROUTES.CABINET,
};

export function getPostLoginRedirect(
  onboarding: OnboardingStatus,
  redirectParam?: string | null,
): string {
  if (redirectParam) return redirectParam;
  return NEXT_STEP_ROUTES[onboarding.next_step] ?? ROUTES.CABINET;
}

export function getOnboardingStepRoute(nextStep: OnboardingNextStep): string {
  return NEXT_STEP_ROUTES[nextStep] ?? ROUTES.CABINET;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => Promise.reject(),
  logout: () => {},
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const email = getEmailFromToken(token);
    authApi
      .getOnboardingStatus()
      .then((onboarding) => {
        setUser({ onboarding, email });
        setSessionCookie();
      })
      .catch(() => {
        sessionStorage.removeItem("access_token");
        clearSessionCookie();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (token: string): Promise<OnboardingStatus> => {
    sessionStorage.setItem("access_token", token);
    setSessionCookie();
    const email = getEmailFromToken(token);
    const onboarding = await authApi.getOnboardingStatus();
    setUser({ onboarding, email });
    return onboarding;
  }, []);

  const logout = useCallback((): void => {
    authApi.logout().catch(() => {});
    sessionStorage.removeItem("access_token");
    clearSessionCookie();
    setUser(null);
    window.location.href = ROUTES.LOGIN;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
