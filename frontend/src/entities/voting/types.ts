export interface VotingCandidate {
  id: string;
  full_name: string;
  photo_url: string | null;
  description: string | null;
  votes_count?: number;
}

export interface VotingSession {
  id: string;
  title: string;
  description: string | null;
  status: "active" | "completed" | "draft";
  starts_at: string;
  ends_at: string;
  candidates: VotingCandidate[];
  has_voted: boolean;
  voted_candidate_id: string | null;
}

export interface VoteRequest {
  candidate_id: string;
}

export interface VoteResponse {
  message: string;
}
