import Dexie, { type EntityTable } from "dexie";
import type { SyncStatus } from "@/types/database";

export interface LocalSessionRecord {
  id: string;
  participantId?: string;
  createdAt: string;
  updatedAt: string;
  payload: Record<string, unknown>;
}

export interface LocalDraftRecord {
  id: string;
  key: string;
  data: Record<string, unknown>;
  updatedAt: string;
}

export type SyncEntity =
  | "participants"
  | "companies"
  | "challenge_sessions"
  | "answers"
  | "signature_profiles"
  | "achievements"
  | "rewards"
  | "reward_inventory"
  | "reward_claims"
  | "leaderboard"
  | "sales_profiles"
  | "sales_notes"
  | "event_settings";

export type SyncOperation = "upsert" | "insert" | "update" | "delete";

export interface SyncQueueRecord {
  id: string;
  entity: SyncEntity;
  operation: SyncOperation;
  payload: Record<string, unknown>;
  status: SyncStatus;
  attempts: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
  nextAttemptAt: string;
  /** For conflict resolution — last-write-wins by client timestamp */
  clientTimestamp: string;
}

export interface AnalyticsEventRecord {
  id: string;
  eventName: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

class MagnusOfflineDatabase extends Dexie {
  sessions!: EntityTable<LocalSessionRecord, "id">;
  drafts!: EntityTable<LocalDraftRecord, "id">;
  syncQueue!: EntityTable<SyncQueueRecord, "id">;
  analytics!: EntityTable<AnalyticsEventRecord, "id">;

  constructor() {
    super("magnus-hr-challenge");
    this.version(1).stores({
      sessions: "id, participantId, updatedAt",
      drafts: "id, key, updatedAt",
    });
    this.version(2).stores({
      sessions: "id, participantId, updatedAt",
      drafts: "id, key, updatedAt",
      syncQueue: "id, entity, status, nextAttemptAt, updatedAt",
      analytics: "id, eventName, createdAt",
    });
  }
}

let db: MagnusOfflineDatabase | null = null;

export function getOfflineDatabase(): MagnusOfflineDatabase {
  if (!db) {
    db = new MagnusOfflineDatabase();
  }
  return db;
}

export type { MagnusOfflineDatabase };
