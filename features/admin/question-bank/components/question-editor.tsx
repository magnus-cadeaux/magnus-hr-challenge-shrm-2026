"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { Flex, Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import {
  CHALLENGE_CATEGORIES,
  CHALLENGE_CATEGORY_LABELS,
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  SIGNATURE_DIMENSIONS,
  type ChallengeCategoryId,
  type ChallengeOptionConfig,
  type QuestionType,
  type SignatureDimension,
} from "@/features/challenge/engine/types";
import {
  DIFFICULTY_LABELS,
  createEmptyOption,
  type ManagedQuestion,
  type QuestionDifficulty,
} from "../types";
import { cn } from "@/lib/utils";

interface QuestionEditorProps {
  question: ManagedQuestion | null;
  onSave: (question: ManagedQuestion) => void;
  onDelete: (id: string) => void;
}

const selectClass =
  "h-12 w-full rounded-xl border border-input bg-white/5 px-3 text-sm text-foreground";
const fieldClass =
  "w-full rounded-xl border border-input bg-white/5 px-3 py-2 text-sm text-foreground";

export function QuestionEditor({
  question,
  onSave,
  onDelete,
}: QuestionEditorProps) {
  const [draft, setDraft] = useState<ManagedQuestion | null>(question);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setDraft(question);
    setTagInput("");
  }, [question]);

  if (!draft) {
    return (
      <GlassCard intensity="subtle" padding="lg">
        <Text variant="caption">
          Select a question from the list, or create a new one.
        </Text>
      </GlassCard>
    );
  }

  const updateOption = (
    index: number,
    patch: Partial<ChallengeOptionConfig>,
  ) => {
    setDraft({
      ...draft,
      options: draft.options.map((option, i) =>
        i === index ? { ...option, ...patch } : option,
      ),
    });
  };

  const updateImpact = (
    optionIndex: number,
    dimension: SignatureDimension,
    value: number,
  ) => {
    const option = draft.options[optionIndex];
    if (!option) return;
    const impacts = { ...option.impacts };
    if (!value) delete impacts[dimension];
    else impacts[dimension] = value;
    updateOption(optionIndex, { impacts });
  };

  const toggleCorrect = (optionId: string) => {
    const exists = draft.correctOptionIds.includes(optionId);
    setDraft({
      ...draft,
      correctOptionIds: exists
        ? draft.correctOptionIds.filter((id) => id !== optionId)
        : [...draft.correctOptionIds, optionId],
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || draft.tags.includes(tag)) return;
    setDraft({ ...draft, tags: [...draft.tags, tag] });
    setTagInput("");
  };

  return (
    <Stack gap="lg">
      <Flex justify="between" align="center" wrap className="gap-3">
        <Text variant="heading" className="text-xl">
          Edit Question
        </Text>
        <Flex gap="sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(draft.id)}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button size="sm" onClick={() => onSave(draft)}>
            Save
          </Button>
        </Flex>
      </Flex>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <Text variant="micro">Type</Text>
          <select
            className={selectClass}
            value={draft.type}
            onChange={(event) =>
              setDraft({ ...draft, type: event.target.value as QuestionType })
            }
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {QUESTION_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <Text variant="micro">Category</Text>
          <select
            className={selectClass}
            value={draft.category}
            onChange={(event) =>
              setDraft({
                ...draft,
                category: event.target.value as ChallengeCategoryId,
              })
            }
          >
            {CHALLENGE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CHALLENGE_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <Text variant="micro">Difficulty</Text>
          <select
            className={selectClass}
            value={draft.difficulty}
            onChange={(event) =>
              setDraft({
                ...draft,
                difficulty: event.target.value as QuestionDifficulty,
              })
            }
          >
            {(Object.keys(DIFFICULTY_LABELS) as QuestionDifficulty[]).map(
              (level) => (
                <option key={level} value={level}>
                  {DIFFICULTY_LABELS[level]}
                </option>
              ),
            )}
          </select>
        </label>
        <label className="flex items-end gap-3 pb-2">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(event) =>
              setDraft({ ...draft, active: event.target.checked })
            }
            className="size-5 accent-blue-500"
          />
          <Text variant="body">Active in participant sessions</Text>
        </label>
      </div>

      <label className="grid gap-2">
        <Text variant="micro">Prompt</Text>
        <Textarea
          value={draft.prompt}
          onChange={(event) =>
            setDraft({ ...draft, prompt: event.target.value })
          }
          placeholder="Question text shown to participants"
          className="min-h-28"
        />
      </label>

      <label className="grid gap-2">
        <Text variant="micro">Explanation (after answering)</Text>
        <Textarea
          value={draft.insight}
          onChange={(event) =>
            setDraft({ ...draft, insight: event.target.value })
          }
          placeholder="Insight / explanation card copy"
          className="min-h-24"
        />
      </label>

      <Stack gap="sm">
        <Text variant="micro">Tags</Text>
        <Flex gap="sm" wrap>
          {draft.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs"
              onClick={() =>
                setDraft({
                  ...draft,
                  tags: draft.tags.filter((item) => item !== tag),
                })
              }
            >
              {tag} ×
            </button>
          ))}
        </Flex>
        <Flex gap="sm">
          <Input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag"
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            Add
          </Button>
        </Flex>
      </Stack>

      <Stack gap="md">
        <Flex justify="between" align="center">
          <Text variant="heading" className="text-lg">
            Options
          </Text>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              setDraft({
                ...draft,
                options: [
                  ...draft.options,
                  createEmptyOption(draft.id, draft.options.length),
                ],
              })
            }
          >
            <Plus className="size-4" />
            Add option
          </Button>
        </Flex>

        {draft.options.map((option, index) => (
          <GlassCard key={option.id} intensity="subtle" padding="md">
            <Stack gap="md">
              <Flex justify="between" gap="sm" wrap>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={draft.correctOptionIds.includes(option.id)}
                    onChange={() => toggleCorrect(option.id)}
                    className="size-4 accent-blue-500"
                  />
                  <Text variant="caption">Correct / key answer</Text>
                </label>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  disabled={draft.options.length <= 2}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      options: draft.options.filter((_, i) => i !== index),
                      correctOptionIds: draft.correctOptionIds.filter(
                        (id) => id !== option.id,
                      ),
                    })
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </Flex>

              <Input
                value={option.label}
                onChange={(event) =>
                  updateOption(index, { label: event.target.value })
                }
                placeholder={`Option ${index + 1} label`}
              />

              {draft.type === "image_choice" ? (
                <Input
                  value={option.imageSrc ?? ""}
                  onChange={(event) =>
                    updateOption(index, {
                      imageSrc: event.target.value || undefined,
                    })
                  }
                  placeholder="Image path e.g. /images/…"
                />
              ) : null}

              <div>
                <Text variant="micro" className="mb-2">
                  HR Signature weight mapping
                </Text>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {SIGNATURE_DIMENSIONS.map((dimension) => (
                    <label key={dimension} className="grid gap-1">
                      <Text variant="caption" className="capitalize">
                        {dimension}
                      </Text>
                      <input
                        type="number"
                        min={0}
                        max={5}
                        className={cn(fieldClass, "h-10")}
                        value={option.impacts[dimension] ?? ""}
                        onChange={(event) =>
                          updateImpact(
                            index,
                            dimension,
                            Number(event.target.value) || 0,
                          )
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </Stack>
          </GlassCard>
        ))}
      </Stack>

      <GlassCard intensity="subtle" padding="md">
        <Text variant="heading" className="mb-3 text-lg">
          Statistics
        </Text>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatPlaceholder
            label="Times asked"
            value={String(draft.stats.timesAsked)}
          />
          <StatPlaceholder
            label="Correctness %"
            value={
              draft.stats.correctnessPercent == null
                ? "—"
                : `${draft.stats.correctnessPercent}%`
            }
          />
          <StatPlaceholder
            label="Avg response time"
            value={
              draft.stats.averageResponseMs == null
                ? "—"
                : `${Math.round(draft.stats.averageResponseMs / 1000)}s`
            }
          />
        </div>
        <Text variant="caption" className="mt-3">
          Analytics placeholders — connect when live sessions report metrics.
        </Text>
      </GlassCard>
    </Stack>
  );
}

function StatPlaceholder({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <Text variant="micro" className="mb-1">
        {label}
      </Text>
      <Text as="div" className="text-2xl font-bold tabular-nums">
        {value}
      </Text>
    </div>
  );
}
