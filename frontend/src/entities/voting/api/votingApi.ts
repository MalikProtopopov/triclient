import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type { VotingSession, VoteResponse } from "../types";

export const votingApi = {
  getActive: async (): Promise<VotingSession | null> => {
    try {
      return await apiClient.get<VotingSession>(API_ENDPOINTS.VOTING.ACTIVE);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) return null;
      throw error;
    }
  },

  vote: (sessionId: string, candidateId: string): Promise<VoteResponse> =>
    apiClient.post(API_ENDPOINTS.VOTING.VOTE(sessionId), {
      candidate_id: candidateId,
    }),
};
