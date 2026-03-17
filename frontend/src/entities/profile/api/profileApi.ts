import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config";

import type {
  PersonalProfile,
  PublicProfile,
  ProfileEvent,
  UpdatePersonalRequest,
} from "../types";

export const profileApi = {
  getPersonal: (): Promise<PersonalProfile> =>
    apiClient.get(API_ENDPOINTS.PROFILE.PERSONAL),

  updatePersonal: (data: UpdatePersonalRequest): Promise<PersonalProfile> =>
    apiClient.patch(API_ENDPOINTS.PROFILE.PERSONAL, data),

  getPublic: (): Promise<PublicProfile> =>
    apiClient.get(API_ENDPOINTS.PROFILE.PUBLIC),

  updatePublic: (data: Partial<PublicProfile>): Promise<PublicProfile> =>
    apiClient.patch(API_ENDPOINTS.PROFILE.PUBLIC, data),

  uploadPhoto: (formData: FormData): Promise<{ photo_url: string }> =>
    apiClient.post(API_ENDPOINTS.PROFILE.PHOTO, formData),

  uploadDiplomaPhoto: (formData: FormData): Promise<{ diploma_photo_url: string }> =>
    apiClient.post(API_ENDPOINTS.PROFILE.DIPLOMA_PHOTO, formData),

  getEvents: async (): Promise<ProfileEvent[]> => {
    const response = await apiClient.get<{ data: ProfileEvent[] }>(
      API_ENDPOINTS.PROFILE.EVENTS,
    );
    return response.data;
  },
};
