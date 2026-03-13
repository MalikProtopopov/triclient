import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { eventApi } from "../api/eventApi";
import type {
  EventFilters,
  EventRegistrationRequest,
  ConfirmGuestRegistrationRequest,
} from "../types";

export const eventKeys = {
  all: ["events"] as const,
  list: (filters?: EventFilters) => [...eventKeys.all, "list", filters] as const,
  detail: (slug: string) => [...eventKeys.all, "detail", slug] as const,
};

export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => eventApi.getList(filters),
  });
};

export const useEvent = (slug: string) => {
  return useQuery({
    queryKey: eventKeys.detail(slug),
    queryFn: () => eventApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useEventRegisterMutation = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EventRegistrationRequest) => eventApi.register(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
};

export const useConfirmGuestMutation = (eventId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfirmGuestRegistrationRequest) => eventApi.confirmGuest(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
};
