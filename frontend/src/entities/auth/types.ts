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
  /** До выбора роли в БД бэкенд может отдавать `pending` */
  role?: "doctor" | "user" | "pending";
}

export interface AuthMeResponse {
  id: string;
  email: string;
  /** Эффективная роль из БД; `pending` пока роль не выбрана через онбординг */
  role: "doctor" | "user" | "pending";
  is_staff: boolean;
  sidebar_sections: string[];
  /** Для роли doctor — из профиля врача; иначе обычно null */
  specialization?: string | null;
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
  | "wait_moderation"
  | "pay_entry_fee"
  | "completed"
  | "done"
  /** Staff (admin / manager / accountant) — клиентский онбординг не применяется */
  | "not_applicable";

export type ModerationStatusValue =
  | "pending_review"
  | "approved"
  | "rejected"
  | "active"
  | "deactivated"
  | null;

export interface DoctorOnboardingSummary {
  moderation_status: ModerationStatusValue;
  submitted_at: string | null;
  rejection_comment: string | null;
}

export interface OnboardingStatus {
  email_verified: boolean;
  role_chosen: boolean;
  role: string | null;
  profile_filled: boolean;
  documents_uploaded: boolean;
  has_medical_diploma: boolean;
  moderation_status: ModerationStatusValue;
  submitted_at: string | null;
  rejection_comment: string | null;
  next_step: OnboardingNextStep;
  /** false для staff — не показывать клиентский онбординг (если нет в ответе — считаем true) */
  onboarding_applicable?: boolean;
  /** true — апгрейд user → doctor через повторный choose-role */
  can_upgrade_to_doctor?: boolean;
  /** Краткая подпись шага на русском */
  status_label?: string | null;
  /** Сводка по заявке врача; у staff — null */
  doctor_onboarding_summary?: DoctorOnboardingSummary | null;
}

export interface ChooseRoleRequest {
  role: "doctor" | "user";
}

/** Ответ POST /onboarding/choose-role; при реальном изменении роли — новый JWT */
export interface ChooseRoleResponse {
  message?: string;
  access_token?: string;
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
