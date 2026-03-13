import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type { TelegramBinding, GenerateCodeResponse } from "../types";

export const telegramApi = {
  getBinding: (): Promise<TelegramBinding> =>
    apiClient.get(API_ENDPOINTS.TELEGRAM.BINDING),

  generateCode: (): Promise<GenerateCodeResponse> =>
    apiClient.post(API_ENDPOINTS.TELEGRAM.GENERATE_CODE),
};
