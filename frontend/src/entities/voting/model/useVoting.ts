import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { votingApi } from "../api/votingApi";

export const votingKeys = {
  all: ["voting"] as const,
  active: () => [...votingKeys.all, "active"] as const,
};

export const useActiveVoting = () => {
  return useQuery({
    queryKey: votingKeys.active(),
    queryFn: () => votingApi.getActive(),
  });
};

export const useVoteMutation = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (candidateId: string) => votingApi.vote(sessionId, candidateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: votingKeys.active() });
    },
  });
};
