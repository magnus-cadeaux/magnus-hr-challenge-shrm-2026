"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getQuestionBankProvider } from "./provider";
import { filterQuestions } from "./io";
import {
  createBlankQuestion,
  duplicateManagedQuestion,
  type ManagedQuestion,
  type QuestionBankFilters,
} from "./types";

const DEFAULT_FILTERS: QuestionBankFilters = {
  search: "",
  category: "all",
  type: "all",
  status: "all",
};

export function useQuestionBank() {
  const provider = useMemo(() => getQuestionBankProvider(), []);
  const [questions, setQuestions] = useState<ManagedQuestion[]>([]);
  const [filters, setFilters] = useState<QuestionBankFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await provider.list();
    setQuestions(list);
    setLoading(false);
    return list;
  }, [provider]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(
    () => filterQuestions(questions, filters),
    [questions, filters],
  );

  const selected =
    questions.find((question) => question.id === selectedId) ?? null;

  const createQuestion = async () => {
    const blank = createBlankQuestion("multiple_choice", questions.length);
    await provider.upsert(blank);
    const list = await refresh();
    setSelectedId(blank.id);
    return list.find((item) => item.id === blank.id) ?? blank;
  };

  const saveQuestion = async (question: ManagedQuestion) => {
    const next = {
      ...question,
      updatedAt: new Date().toISOString(),
    };
    await provider.upsert(next);
    await refresh();
    setSelectedId(next.id);
    return next;
  };

  const removeQuestion = async (id: string) => {
    await provider.remove(id);
    if (selectedId === id) setSelectedId(null);
    await refresh();
  };

  const duplicateQuestion = async (id: string) => {
    const source = questions.find((item) => item.id === id);
    if (!source) return null;
    const copy = duplicateManagedQuestion(source, questions.length);
    await provider.upsert(copy);
    await refresh();
    setSelectedId(copy.id);
    return copy;
  };

  const toggleActive = async (id: string) => {
    const source = questions.find((item) => item.id === id);
    if (!source) return;
    await saveQuestion({ ...source, active: !source.active });
  };

  const reorder = async (orderedIds: string[]) => {
    // Preserve items outside the filtered view, insert filtered order in place
    const filteredSet = new Set(orderedIds);
    const untouched = questions
      .filter((question) => !filteredSet.has(question.id))
      .map((question) => question.id);
    const merged = [...orderedIds, ...untouched];
    const next = await provider.reorder(merged);
    setQuestions(next);
  };

  const replaceAll = async (next: ManagedQuestion[]) => {
    const stamped = next.map((question, index) => ({
      ...question,
      sortOrder: index,
      updatedAt: new Date().toISOString(),
    }));
    await provider.replaceAll(stamped);
    await refresh();
  };

  return {
    questions,
    filtered,
    filters,
    setFilters,
    loading,
    selected,
    selectedId,
    setSelectedId,
    refresh,
    createQuestion,
    saveQuestion,
    removeQuestion,
    duplicateQuestion,
    toggleActive,
    reorder,
    replaceAll,
  };
}
