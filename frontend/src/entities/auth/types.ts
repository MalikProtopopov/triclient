export interface User {
  id: string;
  email: string;
  roles: string[];
  email_verified: boolean;
  has_chosen_role: boolean;
  onboarding_completed: boolean;
  moderation_status: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role?: "doctor" | "user";
}

export interface AuthMeResponse {
  id: string;
  email: string;
  role: "doctor" | "user";
  is_staff: boolean;
  sidebar_sections: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  re_password: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export type OnboardingNextStep =
  | "verify_email"
  | "choose_role"
  | "fill_profile"
  | "upload_documents"
  | "submit"
  | "await_moderation"
  | "pay_entry_fee"
  | "completed";

export interface OnboardingStatus {
  email_verified: boolean;
  role_chosen: boolean;
  role: string | null;
  profile_filled: boolean;
  documents_uploaded: boolean;
  has_medical_diploma: boolean;
  moderation_status: "pending" | "approved" | "rejected" | null;
  submitted_at: string | null;
  rejection_comment: string | null;
  next_step: OnboardingNextStep;
}

export interface ChooseRoleRequest {
  role: "doctor" | "user";
}

export interface DoctorProfileRequest {
  last_name: string;
  first_name: string;
  middle_name?: string;
  phone: string;
  passport_data?: string;
  city_id: string;
  clinic_name?: string;
  position?: string;
  specialization?: string;
  academic_degree?: string;
}

export interface ChangeEmailRequest {
  new_email: string;
  current_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
