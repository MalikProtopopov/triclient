import { useQuery } from "@tanstack/react-query";

import { certificateApi } from "../api/certificateApi";

export const certificateKeys = {
  all: ["certificates"] as const,
  list: () => [...certificateKeys.all, "list"] as const,
};

export const useCertificates = () => {
  return useQuery({
    queryKey: certificateKeys.list(),
    queryFn: () => certificateApi.getList(),
  });
};
