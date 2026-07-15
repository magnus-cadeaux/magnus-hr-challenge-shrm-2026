import { getSupabaseBrowserClient } from "@/services/supabase/client";
import { downloadCsv, filenameForExport, toCsv, type ExportKind } from "./csv";

async function fetchRows(kind: ExportKind): Promise<
  Array<Record<string, string | number | boolean | null | undefined>>
> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return [
      {
        notice: "Supabase not configured — export placeholder",
        kind,
        generatedAt: new Date().toISOString(),
      },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = client as any;

  switch (kind) {
    case "participants": {
      const { data } = await db
        .from("participants")
        .select(
          "id,full_name,email,phone,company_name,started_at,completed_at,created_at",
        )
        .order("created_at", { ascending: false });
      return (data ?? []) as Array<Record<string, string | number | null>>;
    }
    case "leads": {
      const { data } = await db
        .from("sales_profiles")
        .select(
          "id,local_session_id,lead_score,decision_confidence,organisation_maturity,conversation_status,updated_at",
        )
        .order("updated_at", { ascending: false });
      return (data ?? []) as Array<Record<string, string | number | null>>;
    }
    case "inventory": {
      const { data } = await db
        .from("reward_inventory")
        .select(
          "gift_key,name,tier,stock,reserved,distributed,low_stock_threshold,active,updated_at",
        )
        .order("tier");
      return (data ?? []) as Array<
        Record<string, string | number | boolean | null>
      >;
    }
    case "challenge_sessions": {
      const { data } = await db
        .from("challenge_sessions")
        .select(
          "id,local_session_id,status,started_at,completed_at,elapsed_ms,created_at",
        )
        .order("created_at", { ascending: false });
      return (data ?? []) as Array<Record<string, string | number | null>>;
    }
    default:
      return [];
  }
}

export async function exportCsv(kind: ExportKind): Promise<void> {
  const rows = await fetchRows(kind);
  downloadCsv(filenameForExport(kind), toCsv(rows));
}

export { toCsv, downloadCsv, filenameForExport };
export type { ExportKind };
