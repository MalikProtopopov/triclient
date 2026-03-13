import { useQuery } from "@tanstack/react-query";

import { articleApi } from "../api/articleApi";
import type { ArticleFilters } from "../types";

export const articleKeys = {
  all: ["articles"] as const,
  list: (filters?: ArticleFilters) => [...articleKeys.all, "list", filters] as const,
  detail: (slug: string) => [...articleKeys.all, "detail", slug] as const,
  themes: ["article-themes"] as const,
};

export const useArticles = (filters?: ArticleFilters) => {
  return useQuery({
    queryKey: articleKeys.list(filters),
    queryFn: () => articleApi.getList(filters),
  });
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => articleApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useArticleThemes = () => {
  return useQuery({
    queryKey: articleKeys.themes,
    queryFn: () => articleApi.getThemes(),
  });
};
