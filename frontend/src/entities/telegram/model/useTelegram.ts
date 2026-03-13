import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { telegramApi } from "../api/telegramApi";

export const telegramKeys = {
  all: ["telegram"] as const,
  binding: () => [...telegramKeys.all, "binding"] as const,
};

export const useTelegramBinding = () => {
  return useQuery({
    queryKey: telegramKeys.binding(),
    queryFn: () => telegramApi.getBinding(),
  });
};

export const useGenerateCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => telegramApi.generateCode(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: telegramKeys.binding() });
    },
  });
};
