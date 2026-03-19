import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OnboardingStatus,
  AuthMeResponse,
  ChooseRoleRequest,
  DoctorProfileRequest,
  ChangeEmailRequest,
  ChangePasswordRequest,
} from "../types";

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterRequest): Promise<RegisterResponse> =>
    apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data),

  verifyEmail: (data: VerifyEmailRequest): Promise<VerifyEmailResponse> =>
    apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data),

  resendVerificationEmail: (email: string): Promise<{ message?: string }> =>
    apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL, { email }),

  forgotPassword: (data: ForgotPasswordRequest): Promise<{ message: string }> =>
    apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data),

  resetPassword: (data: ResetPasswordRequest): Promise<{ message: string }> =>
    apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),

  logout: (): Promise<{ message: string }> =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

  getMe: (): Promise<AuthMeResponse> =>
    apiClient.get(API_ENDPOINTS.AUTH.ME),

  getOnboardingStatus: (): Promise<OnboardingStatus> =>
    apiClient.get(API_ENDPOINTS.ONBOARDING.STATUS),

  chooseRole: (data: ChooseRoleRequest): Promise<{ message: string }> =>
    apiClient.post(API_ENDPOINTS.ONBOARDING.CHOOSE_ROLE, data),

  saveDoctorProfile: (data: DoctorProfileRequest): Promise<{ message: string }> =>
    apiClient.patch(API_ENDPOINTS.ONBOARDING.DOCTOR_PROFILE, data),

  uploadDocument: (formData: FormData): Promise<{ id: string }> =>
    apiClient.post(API_ENDPOINTS.ONBOARDING.DOCUMENTS, formData),

  submitOnboarding: (): Promise<{ message: string }> =>
    apiClient.post(API_ENDPOINTS.ONBOARDING.SUBMIT),

  changeEmail: (data: ChangeEmailRequest): Promise<{ message: string }> =>
    apiClient.post(API_ENDPOINTS.AUTH.CHANGE_EMAIL, {
      new_email: data.new_email,
      password: data.current_password,
    }),

  changePassword: (data: ChangePasswordRequest): Promise<{ message: string }> =>
    apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
};
