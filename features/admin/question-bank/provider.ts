import { isBrowser } from "@/utils/device";
import { STORAGE_KEYS } from "@/lib/constants";
import { getOfflineDatabase } from "@/services/storage/dexie";
import type { ManagedQuestion, QuestionBankProvider } from "./types";

export const QUESTION_BANK_STORAGE_KEY = STORAGE_KEYS.questionBank;
const DEXIE_BANK_ID = "question_bank:current";

let memoryBank: ManagedQuestion[] | null = null;

function readStore(): ManagedQuestion[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(QUESTION_BANK_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ManagedQuestion[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function readStoreAsync(): Promise<ManagedQuestion[]> {
  const local = readStore();
  if (local.length > 0) {
    memoryBank = local;
    return local;
  }
  if (!isBrowser()) return [];
  try {
    const row = await getOfflineDatabase().drafts.get(DEXIE_BANK_ID);
    const data = row?.data as unknown;
    let list: ManagedQuestion[] = [];
    if (Array.isArray(data)) {
      list = data as ManagedQuestion[];
    } else if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as { questions?: unknown }).questions)
    ) {
      list = (data as { questions: ManagedQuestion[] }).questions;
    }
    memoryBank = list;
    return list;
  } catch {
    /* ignore */
  }
  return memoryBank ?? [];
}

/** Sync peek for the challenge loader when localStorage was cleared after a large import. */
export function peekManagedQuestionBank(): ManagedQuestion[] {
  if (memoryBank && memoryBank.length > 0) return memoryBank;
  return readStore();
}

function writeLocalStorage(questions: ManagedQuestion[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(
    QUESTION_BANK_STORAGE_KEY,
    JSON.stringify(questions),
  );
}

async function writeStoreAsync(questions: ManagedQuestion[]): Promise<void> {
  if (!isBrowser()) return;
  memoryBank = questions;

  await getOfflineDatabase().drafts.put({
    id: DEXIE_BANK_ID,
    key: "question_bank",
    data: { questions } as unknown as Record<string, unknown>,
    updatedAt: new Date().toISOString(),
  });

  try {
    writeLocalStorage(questions);
  } catch (error) {
    window.localStorage.removeItem(QUESTION_BANK_STORAGE_KEY);
    const message =
      error instanceof Error ? error.message : "Failed to save question bank";
    console.warn(
      `[question-bank] localStorage unavailable (${message}); using IndexedDB.`,
    );
  }
}

/**
 * Local question bank provider (localStorage + Dexie for large imports).
 * Swap for a Supabase provider with the same interface — no UI changes required.
 */
export const localQuestionBankProvider: QuestionBankProvider = {
  async list() {
    const stored = await readStoreAsync();
    let changed = false;
    const next = stored.map((question) => {
      // No image assets shipping tonight — keep image_choice out of active pool.
      if (question.type === "image_choice" && question.active) {
        changed = true;
        return {
          ...question,
          active: false,
          updatedAt: new Date().toISOString(),
        };
      }
      return question;
    });
    if (changed) await writeStoreAsync(next);
    return [...next].sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async get(id) {
    return (await readStoreAsync()).find((item) => item.id === id) ?? null;
  },

  async upsert(question) {
    const next = (await readStoreAsync()).filter(
      (item) => item.id !== question.id,
    );
    next.push(question);
    await writeStoreAsync(next);
    return question;
  },

  async remove(id) {
    await writeStoreAsync(
      (await readStoreAsync()).filter((item) => item.id !== id),
    );
  },

  async replaceAll(questions) {
    await writeStoreAsync(questions);
  },

  async reorder(orderedIds) {
    const map = new Map(
      (await readStoreAsync()).map((item) => [item.id, item]),
    );
    const now = new Date().toISOString();
    const next = orderedIds
      .map((id, index) => {
        const item = map.get(id);
        if (!item) return null;
        return { ...item, sortOrder: index, updatedAt: now };
      })
      .filter(Boolean) as ManagedQuestion[];

    for (const item of map.values()) {
      if (!orderedIds.includes(item.id)) {
        next.push({ ...item, sortOrder: next.length, updatedAt: now });
      }
    }

    await writeStoreAsync(next);
    return next;
  },
};

export function getQuestionBankProvider(): QuestionBankProvider {
  // Future: if (isSupabaseConfigured()) return supabaseQuestionBankProvider;
  return localQuestionBankProvider;
}
