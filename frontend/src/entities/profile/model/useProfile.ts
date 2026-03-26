import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "../api/profileApi";
import type {
  PublicProfile,
  UpdatePersonalRequest,
  UploadPhotoResponse,
  EventRegistrationsQueryParams,
} from "../types";

export const profileKeys = {
  all: ["profile"] as const,
  personal: () => [...profileKeys.all, "personal"] as const,
  public: () => [...profileKeys.all, "public"] as const,
  events: () => [...profileKeys.all, "events"] as const,
  eventRegistrations: (params?: EventRegistrationsQueryParams) =>
    [...profileKeys.all, "eventRegistrations", params] as const,
};

export const usePersonalProfile = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: profileKeys.personal(),
    queryFn: () => profileApi.getPersonal(),
    enabled: options?.enabled,
  });

export const useUpdatePersonalMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePersonalRequest) => profileApi.updatePersonal(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.personal() });
    },
  });
};

export const usePublicProfile = () =>
  useQuery({
    queryKey: profileKeys.public(),
    queryFn: () => profileApi.getPublic(),
  });

export const useUpdatePublicMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PublicProfile>) => profileApi.updatePublic(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.public() });
    },
  });
};

export const useSubmitPublicProfileMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => profileApi.submitPublic(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.public() });
    },
  });
};

export const useUploadPhotoMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => profileApi.uploadPhoto(formData),
    onSuccess: (data: UploadPhotoResponse) => {
      qc.setQueryData<PublicProfile>(profileKeys.public(), (old) =>
        old
          ? {
              ...old,
              photo_url: data.photo_url,
              photo_pending_moderation: data.pending_moderation,
            }
          : undefined
      );
    },
  });
};

export const useUploadDiplomaMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => profileApi.uploadDiplomaPhoto(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.personal() });
    },
  });
};

export const useProfileEvents = () =>
  useQuery({
    queryKey: profileKeys.events(),
    queryFn: () => profileApi.getEvents(),
  });

export const useEventRegistrations = (options?: {
  enabled?: boolean;
  params?: EventRegistrationsQueryParams;
}) =>
  useQuery({
    queryKey: profileKeys.eventRegistrations(options?.params),
    queryFn: () => profileApi.getEventRegistrations(options?.params),
    enabled: options?.enabled ?? true,
    refetchOnWindowFocus: true,
  });
