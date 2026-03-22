export type VotingStatus = "draft" | "active" | "closed" | "cancelled";

export interface VotingCandidate {
  id: string;
  doctor_profile_id?: string;
  full_name: string;
  photo_url: string | null;
  description: string | null;
  sort_order?: number;
  votes_count?: number;
}

export interface VotingSession {
  id: string;
  title: string;
  description: string | null;
  status: VotingStatus;
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
