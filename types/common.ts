export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

export interface Identifiable {
  id: string;
}

export type WithIdAndTimestamps = Identifiable & Timestamped;
