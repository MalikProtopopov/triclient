import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config";

import type { OrganizationDocument, DocumentListResponse } from "../types";

export const documentApi = {
  getList: (): Promise<DocumentListResponse> =>
    apiClient.get(API_ENDPOINTS.DOCUMENTS.LIST),

  getBySlug: (slug: string): Promise<OrganizationDocument> =>
    apiClient.get(API_ENDPOINTS.DOCUMENTS.BY_SLUG(slug)),
};
