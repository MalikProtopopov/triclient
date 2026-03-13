import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config";

import type {
  ArticleResponseSchema,
  ArticleListResponseSchema,
  ArticleFilters,
  ArticleTheme,
} from "../types";

export const articleApi = {
  getList: (filters?: ArticleFilters): Promise<ArticleListResponseSchema> =>
    apiClient.get(API_ENDPOINTS.ARTICLES.LIST, { params: filters }),

  getBySlug: (slug: string): Promise<ArticleResponseSchema> =>
    apiClient.get(API_ENDPOINTS.ARTICLES.BY_SLUG(slug)),

  getThemes: async (): Promise<ArticleTheme[]> => {
    const response = await apiClient.get<{ data: ArticleTheme[] }>(
      API_ENDPOINTS.ARTICLE_THEMES,
    );
    return response.data;
  },
};
