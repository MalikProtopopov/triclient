import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "../api/authApi";
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChooseRoleRequest,
  DoctorProfileRequest,
  ChangeEmailRequest,
  ChangePasswordRequest,
} from "../types";

export const authKeys = {
  onboardingStatus: ["onboarding", "status"] as const,
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: (data: VerifyEmailRequest) => authApi.verifyEmail(data),
  });

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
  });

export const useChooseRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChooseRoleRequest) => authApi.chooseRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.onboardingStatus });
    },
  });
};

export const useSaveDoctorProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DoctorProfileRequest) => authApi.saveDoctorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.onboardingStatus });
    },
  });
};

export const useUploadDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => authApi.uploadDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.onboardingStatus });
    },
  });
};

export const useSubmitOnboardingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.submitOnboarding(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.onboardingStatus });
    },
  });
};

export const useOnboardingStatus = (options?: {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}) =>
  useQuery({
    queryKey: authKeys.onboardingStatus,
    queryFn: () => authApi.getOnboardingStatus(),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
  });

export const useChangeEmailMutation = () =>
  useMutation({
    mutationFn: (data: ChangeEmailRequest) => authApi.changeEmail(data),
  });

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
  });
