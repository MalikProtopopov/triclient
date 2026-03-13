"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { authApi } from "@/entities/auth";
import type { User as AuthUser, OnboardingNextStep } from "@/entities/auth";
import { ROUTES } from "@/shared/config";

export interface User extends AuthUser {
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
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

export function getPostLoginRedirect(user: User, redirectParam?: string | null): string {
  if (redirectParam) return redirectParam;
  if (!user.has_chosen_role) return ROUTES.ONBOARDING_ROLE;
  if (!user.onboarding_completed) return ROUTES.ONBOARDING_PENDING;
  return ROUTES.CABINET;
}

export function getOnboardingStepRoute(nextStep: OnboardingNextStep): string {
  return NEXT_STEP_ROUTES[nextStep] ?? ROUTES.CABINET;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    const savedUser = sessionStorage.getItem("user");

    if (!token || !savedUser) {
      setIsLoading(false);
      return;
    }

    let parsed: User | null = null;
    try {
      parsed = JSON.parse(savedUser) as User;
    } catch {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user");
      clearSessionCookie();
      setIsLoading(false);
      return;
    }

    authApi
      .getOnboardingStatus()
      .then(() => {
        setUser(parsed);
      })
      .catch(() => {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");
        clearSessionCookie();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback((token: string, userData: User): void => {
    sessionStorage.setItem("access_token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setSessionCookie();
    setUser(userData);
  }, []);

  const logout = useCallback((): void => {
    authApi.logout().catch(() => {});
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
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
