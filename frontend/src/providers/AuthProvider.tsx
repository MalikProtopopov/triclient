"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { authApi } from "@/entities/auth";
import type { OnboardingStatus, OnboardingNextStep } from "@/entities/auth";
import { ROUTES } from "@/shared/config";

const DEFAULT_SIDEBAR_SECTIONS = ["cabinet", "events", "settings"];

export interface SessionUser {
  onboarding: OnboardingStatus;
  email?: string;
  role?: "doctor" | "user";
  sidebarSections: string[];
  specialization?: string | null;
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
  verify_email: ROUTES.ONBOARDING_VERIFY_EMAIL,
  choose_role: ROUTES.ONBOARDING_ROLE,
  fill_profile: ROUTES.ONBOARDING_PROFILE,
  upload_documents: ROUTES.ONBOARDING_PROFILE,
  submit: ROUTES.ONBOARDING_PROFILE,
  await_moderation: ROUTES.ONBOARDING_PENDING,
  wait_moderation: ROUTES.ONBOARDING_PENDING,
  pay_entry_fee: ROUTES.CABINET_PAYMENTS,
  completed: ROUTES.CABINET,
  done: ROUTES.CABINET,
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
      clearSessionCookie();
      setIsLoading(false);
      return;
    }

    Promise.all([authApi.getMe(), authApi.getOnboardingStatus()])
      .then(([me, onboarding]) => {
        setUser({
          onboarding,
          email: me.email,
          role: me.role,
          specialization: me.specialization ?? null,
          sidebarSections: me.sidebar_sections?.length
            ? me.sidebar_sections
            : DEFAULT_SIDEBAR_SECTIONS,
        });
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
    const [me, onboarding] = await Promise.all([
      authApi.getMe(),
      authApi.getOnboardingStatus(),
    ]);
    setUser({
      onboarding,
      email: me.email,
      role: me.role,
      specialization: me.specialization ?? null,
      sidebarSections: me.sidebar_sections?.length
        ? me.sidebar_sections
        : DEFAULT_SIDEBAR_SECTIONS,
    });
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
