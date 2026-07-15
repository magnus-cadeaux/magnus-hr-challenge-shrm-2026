"use client";

import { Download, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flex, Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import {
  CHALLENGE_CATEGORIES,
  CHALLENGE_CATEGORY_LABELS,
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
} from "@/features/challenge/engine/types";
import type { QuestionBankFilters } from "../types";

interface QuestionBankToolbarProps {
  filters: QuestionBankFilters;
  onChange: (filters: QuestionBankFilters) => void;
  onCreate: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  onImportJson: (file: File) => void;
  onImportCsv: (file: File) => void;
  total: number;
  visible: number;
}

const selectClass =
  "h-12 rounded-xl border border-input bg-white/5 px-3 text-sm text-foreground";

export function QuestionBankToolbar({
  filters,
  onChange,
  onCreate,
  onExportJson,
  onExportCsv,
  onImportJson,
  onImportCsv,
  total,
  visible,
}: QuestionBankToolbarProps) {
  return (
    <Stack gap="md">
      <Flex justify="between" align="end" wrap className="gap-4">
        <div>
          <Text variant="heading" className="text-2xl">
            Question Bank
          </Text>
          <Text variant="caption">
            {visible} shown · {total} total · stored locally · Supabase-ready
          </Text>
        </div>
        <Flex gap="sm" wrap>
          <Button size="sm" variant="outline" onClick={onExportJson}>
            <Download className="size-4" />
            JSON
          </Button>
          <Button size="sm" variant="outline" onClick={onExportCsv}>
            <Download className="size-4" />
            CSV
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/8">
            <Upload className="size-4" />
            Import JSON
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onImportJson(file);
                event.target.value = "";
              }}
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/8">
            <Upload className="size-4" />
            Import CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onImportCsv(file);
                event.target.value = "";
              }}
            />
          </label>
          <Button size="sm" onClick={onCreate}>
            <Plus className="size-4" />
            New Question
          </Button>
        </Flex>
      </Flex>

      <div className="grid gap-3 md:grid-cols-4">
        <Input
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Search prompt, tags, options…"
          aria-label="Search questions"
        />
        <select
          className={selectClass}
          value={filters.category}
          onChange={(event) =>
            onChange({
              ...filters,
              category: event.target.value as QuestionBankFilters["category"],
            })
          }
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {CHALLENGE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CHALLENGE_CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value as QuestionBankFilters["type"],
            })
          }
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          {QUESTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {QUESTION_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as QuestionBankFilters["status"],
            })
          }
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </Stack>
  );
}
