import { useQuery } from "@tanstack/react-query";

import { documentApi } from "../api/documentApi";

export const documentKeys = {
  all: ["documents"] as const,
  list: () => [...documentKeys.all, "list"] as const,
  detail: (slug: string) => [...documentKeys.all, "detail", slug] as const,
};

export const useDocuments = () => {
  return useQuery({
    queryKey: documentKeys.list(),
    queryFn: () => documentApi.getList(),
  });
};

export const useDocument = (slug: string) => {
  return useQuery({
    queryKey: documentKeys.detail(slug),
    queryFn: () => documentApi.getBySlug(slug),
    enabled: !!slug,
  });
};
