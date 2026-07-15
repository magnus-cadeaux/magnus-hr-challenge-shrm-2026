"use client";

import { useState } from "react";
import { Stack } from "@/components/layout";
import { Text } from "@/components/typography";
import { useQuestionBank } from "../use-question-bank";
import {
  downloadTextFile,
  questionsFromCsv,
  questionsFromJson,
  questionsToCsv,
  questionsToJson,
} from "../io";
import { QuestionBankToolbar } from "./question-bank-toolbar";
import { QuestionList } from "./question-list";
import { QuestionEditor } from "./question-editor";
import { QuestionPreview } from "./question-preview";

export function QuestionBankManager() {
  const bank = useQuestionBank();
  const [flash, setFlash] = useState<string | null>(null);

  const notify = (message: string) => {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 2600);
  };

  const onExportJson = () => {
    downloadTextFile(
      `magnus-question-bank.json`,
      questionsToJson(bank.questions),
      "application/json",
    );
    notify("JSON exported.");
  };

  const onExportCsv = () => {
    downloadTextFile(
      `magnus-question-bank.csv`,
      questionsToCsv(bank.questions),
      "text/csv;charset=utf-8;",
    );
    notify("CSV exported.");
  };

  const onImportJson = async (file: File) => {
    try {
      const text = await file.text();
      const imported = questionsFromJson(text);
      await bank.replaceAll(imported);
      notify(`Imported ${imported.length} questions from JSON.`);
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "JSON import failed.",
      );
    }
  };

  const onImportCsv = async (file: File) => {
    try {
      const text = await file.text();
      const imported = questionsFromCsv(text);
      await bank.replaceAll(imported);
      notify(`Imported ${imported.length} questions from CSV.`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "CSV import failed.");
    }
  };

  return (
    <Stack gap="xl">
      <QuestionBankToolbar
        filters={bank.filters}
        onChange={bank.setFilters}
        onCreate={() => void bank.createQuestion()}
        onExportJson={onExportJson}
        onExportCsv={onExportCsv}
        onImportJson={(file) => void onImportJson(file)}
        onImportCsv={(file) => void onImportCsv(file)}
        total={bank.questions.length}
        visible={bank.filtered.length}
      />

      {flash ? (
        <Text variant="caption" className="text-blue-200">
          {flash}
        </Text>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Stack gap="md">
          {bank.loading ? (
            <Text variant="caption">Loading question bank…</Text>
          ) : (
            <QuestionList
              questions={bank.filtered}
              selectedId={bank.selectedId}
              onSelect={bank.setSelectedId}
              onReorder={(ids) => void bank.reorder(ids)}
              onDuplicate={(id) => void bank.duplicateQuestion(id)}
              onToggleActive={(id) => void bank.toggleActive(id)}
            />
          )}
        </Stack>

        <Stack gap="xl">
          <QuestionEditor
            question={bank.selected}
            onSave={(question) => void bank.saveQuestion(question)}
            onDelete={(id) => void bank.removeQuestion(id)}
          />
          <QuestionPreview question={bank.selected} />
        </Stack>
      </div>
    </Stack>
  );
}
