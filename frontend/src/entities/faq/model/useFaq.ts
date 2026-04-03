import { useQuery } from "@tanstack/react-query";

import { faqApi } from "../api/faqApi";
import type { FaqFilters } from "../types";

export const faqKeys = {
  all: ["faq"] as const,
  list: (filters?: FaqFilters) => [...faqKeys.all, "list", filters] as const,
  detail: (id: string) => [...faqKeys.all, "detail", id] as const,
};

export const useFaqList = (filters?: FaqFilters) => {
  return useQuery({
    queryKey: faqKeys.list(filters),
    queryFn: () => faqApi.getList(filters),
  });
};

export const useFaqItem = (id: string) => {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => faqApi.getById(id),
    enabled: !!id,
  });
};
