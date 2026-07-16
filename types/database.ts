export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = "anonymous" | "staff" | "admin";
export type ConversationStatus = "pending" | "in_progress" | "complete";
export type GiftTier = "A" | "B" | "C" | "premium_upgrade";
export type SyncStatus = "pending" | "syncing" | "synced" | "failed" | "conflict";

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          industry: string | null;
          normalized_name: string;
          participant_count: number;
          average_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          industry?: string | null;
          participant_count?: number;
          average_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
      };
      participants: {
        Row: {
          id: string;
          local_session_id: string | null;
          full_name: string;
          email: string | null;
          phone: string | null;
          company_id: string | null;
          company_name: string | null;
          device_id: string | null;
          source: string;
          started_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          local_session_id?: string | null;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          company_id?: string | null;
          company_name?: string | null;
          device_id?: string | null;
          source?: string;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["participants"]["Insert"]>;
      };
      challenge_sessions: {
        Row: {
          id: string;
          participant_id: string | null;
          local_session_id: string;
          status: string;
          question_ids: Json;
          dimension_scores: Json;
          started_at: string;
          completed_at: string | null;
          elapsed_ms: number | null;
          device_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          participant_id?: string | null;
          local_session_id: string;
          status?: string;
          question_ids?: Json;
          dimension_scores?: Json;
          started_at?: string;
          completed_at?: string | null;
          elapsed_ms?: number | null;
          device_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["challenge_sessions"]["Insert"]
        >;
      };
      answers: {
        Row: {
          id: string;
          session_id: string;
          question_id: string;
          option_ids: Json;
          impacts: Json;
          answered_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question_id: string;
          option_ids?: Json;
          impacts?: Json;
          answered_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["answers"]["Insert"]>;
      };
      signature_profiles: {
        Row: {
          id: string;
          participant_id: string | null;
          session_id: string | null;
          local_session_id: string | null;
          primary_signature_id: string;
          secondary_signature_id: string;
          display_name: string | null;
          organization: string | null;
          scores: Json;
          normalized_scores: Json;
          insight: string | null;
          recommendations: Json;
          percentile: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          participant_id?: string | null;
          session_id?: string | null;
          local_session_id?: string | null;
          primary_signature_id: string;
          secondary_signature_id: string;
          display_name?: string | null;
          organization?: string | null;
          scores?: Json;
          normalized_scores?: Json;
          insight?: string | null;
          recommendations?: Json;
          percentile?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["signature_profiles"]["Insert"]
        >;
      };
      achievements: {
        Row: {
          id: string;
          participant_id: string | null;
          signature_profile_id: string | null;
          achievement_key: string;
          title: string;
          description: string | null;
          dimension: string | null;
          awarded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_id?: string | null;
          signature_profile_id?: string | null;
          achievement_key: string;
          title: string;
          description?: string | null;
          dimension?: string | null;
          awarded_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Insert"]>;
      };
      reward_inventory: {
        Row: {
          id: string;
          gift_key: string;
          name: string;
          description: string | null;
          image_src: string | null;
          tier: GiftTier;
          stock: number;
          reserved: number;
          distributed: number;
          low_stock_threshold: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gift_key: string;
          name: string;
          description?: string | null;
          image_src?: string | null;
          tier: GiftTier;
          stock?: number;
          reserved?: number;
          distributed?: number;
          low_stock_threshold?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["reward_inventory"]["Insert"]
        >;
      };
      rewards: {
        Row: {
          id: string;
          participant_id: string | null;
          local_session_id: string | null;
          inventory_id: string | null;
          gift_key: string;
          gift_name: string;
          tier: GiftTier;
          collection_code: string;
          upgraded: boolean;
          base_gift_key: string | null;
          assigned_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          participant_id?: string | null;
          local_session_id?: string | null;
          inventory_id?: string | null;
          gift_key: string;
          gift_name: string;
          tier: GiftTier;
          collection_code: string;
          upgraded?: boolean;
          base_gift_key?: string | null;
          assigned_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rewards"]["Insert"]>;
      };
      reward_claims: {
        Row: {
          id: string;
          reward_id: string;
          claimed_by: string | null;
          claimed_at: string;
          device_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reward_id: string;
          claimed_by?: string | null;
          claimed_at?: string;
          device_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reward_claims"]["Insert"]>;
      };
      leaderboard: {
        Row: {
          id: string;
          participant_id: string | null;
          display_name: string;
          company_name: string | null;
          score: number;
          signature_id: string | null;
          signature_name: string | null;
          rank: number | null;
          event_day: string;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_id?: string | null;
          display_name: string;
          company_name?: string | null;
          score?: number;
          signature_id?: string | null;
          signature_name?: string | null;
          rank?: number | null;
          event_day?: string;
          updated_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leaderboard"]["Insert"]>;
      };
      sales_profiles: {
        Row: {
          id: string;
          participant_id: string | null;
          local_session_id: string | null;
          lead_score: number;
          decision_confidence: string | null;
          organisation_maturity: string | null;
          profile: Json;
          conversation_status: ConversationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          participant_id?: string | null;
          local_session_id?: string | null;
          lead_score?: number;
          decision_confidence?: string | null;
          organisation_maturity?: string | null;
          profile?: Json;
          conversation_status?: ConversationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["sales_profiles"]["Insert"]
        >;
      };
      sales_notes: {
        Row: {
          id: string;
          sales_profile_id: string | null;
          participant_id: string | null;
          local_session_id: string | null;
          notes: string;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sales_profile_id?: string | null;
          participant_id?: string | null;
          local_session_id?: string | null;
          notes?: string;
          updated_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sales_notes"]["Insert"]>;
      };
      event_settings: {
        Row: {
          id: string;
          event_key: string;
          event_name: string;
          brand_name: string;
          question_bank_version: string;
          lucky_upgrade_probability: number;
          theme: string;
          reward_inventory_config: Json;
          extras: Json;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_key?: string;
          event_name?: string;
          brand_name?: string;
          question_bank_version?: string;
          lucky_upgrade_probability?: number;
          theme?: string;
          reward_inventory_config?: Json;
          extras?: Json;
          updated_at?: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["event_settings"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_app_role: { Args: Record<string, never>; Returns: string };
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      app_role: AppRole;
      conversation_status: ConversationStatus;
      gift_tier: GiftTier;
      sync_status: SyncStatus;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
