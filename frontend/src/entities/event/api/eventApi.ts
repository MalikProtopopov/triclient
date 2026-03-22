import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config";

import type {
  EventResponseSchema,
  EventListResponseSchema,
  EventFilters,
  EventRegistrationRequest,
  EventRegistrationResponse,
  ConfirmGuestRegistrationRequest,
} from "../types";

export const eventApi = {
  getList: (filters?: EventFilters): Promise<EventListResponseSchema> =>
    apiClient.get(API_ENDPOINTS.EVENTS.LIST, { params: filters }),

  getBySlug: (slug: string): Promise<EventResponseSchema> =>
    apiClient.get(API_ENDPOINTS.EVENTS.BY_SLUG(slug)),

  register: (eventId: string, data: EventRegistrationRequest): Promise<EventRegistrationResponse> =>
    apiClient.post(API_ENDPOINTS.EVENTS.REGISTER(eventId), data),

  confirmGuest: (eventId: string, data: ConfirmGuestRegistrationRequest): Promise<EventRegistrationResponse> =>
    apiClient.post(API_ENDPOINTS.EVENTS.CONFIRM_GUEST(eventId), data),
};
