import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "../api/profileApi";
import type {
  PersonalProfile,
  PublicProfile,
  UpdatePersonalRequest,
} from "../types";

export const profileKeys = {
  all: ["profile"] as const,
  personal: () => [...profileKeys.all, "personal"] as const,
  public: () => [...profileKeys.all, "public"] as const,
  events: () => [...profileKeys.all, "events"] as const,
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

export const useUploadPhotoMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => profileApi.uploadPhoto(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.public() });
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
