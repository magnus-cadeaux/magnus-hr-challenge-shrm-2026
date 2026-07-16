import { describe, expect, it } from "vitest";
import { QUESTION_BANK } from "@/features/challenge/config/question-bank";
import { prepareSessionQuestions } from "@/features/challenge/engine/loader";

describe("Sprint 17 question prep", () => {
  it("keeps opinion_scale options in fixed bank order across replays", () => {
    const scale = QUESTION_BANK.find((q) => q.type === "opinion_scale");
    expect(scale).toBeTruthy();
    const expected = scale!.options.map((option) => option.id);

    for (let i = 0; i < 20; i += 1) {
      const session = prepareSessionQuestions([scale!], 1, () => 0.99);
      expect(session[0]?.type).toBe("opinion_scale");
      expect(session[0]?.options.map((option) => option.id)).toEqual(expected);
    }
  });

  it("never draws image_choice questions from the config bank", () => {
    for (let i = 0; i < 10; i += 1) {
      const session = prepareSessionQuestions(undefined, 6, Math.random);
      expect(session.some((question) => question.type === "image_choice")).toBe(
        false,
      );
    }
  });
});
