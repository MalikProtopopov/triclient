import { useQuery } from "@tanstack/react-query";

import { settingsApi } from "../api/settingsApi";

export const settingsKeys = {
  all: ["settings"] as const,
  public: () => [...settingsKeys.all, "public"] as const,
};

export const usePublicSettings = () =>
  useQuery({
    queryKey: settingsKeys.public(),
    queryFn: () => settingsApi.getPublic(),
    staleTime: 5 * 60 * 1000,
  });
