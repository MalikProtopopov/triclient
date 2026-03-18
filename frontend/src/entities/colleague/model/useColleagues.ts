import { useQuery } from "@tanstack/react-query";

import { colleagueApi } from "../api/colleagueApi";
import type { ColleagueFilters } from "../types";

export const colleagueKeys = {
  all: ["colleagues"] as const,
  list: (params?: ColleagueFilters) =>
    [...colleagueKeys.all, "list", params] as const,
};

export const useColleagues = (params?: ColleagueFilters) =>
  useQuery({
    queryKey: colleagueKeys.list(params),
    queryFn: () => colleagueApi.getList(params),
  });
