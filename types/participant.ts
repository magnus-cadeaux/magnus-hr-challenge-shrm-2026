import type { WithIdAndTimestamps } from "./common";

export interface ParticipantProfile {
  fullName: string;
  email: string;
  organization: string;
  designation: string;
  phone?: string;
}

export type Participant = WithIdAndTimestamps &
  ParticipantProfile & {
    sessionId: string;
  };

export type ParticipantDraft = Partial<ParticipantProfile> & {
  lastSavedAt?: string;
};
