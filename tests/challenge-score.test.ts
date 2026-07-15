import { describe, expect, it } from "vitest";
import { computeChallengeScore } from "@/features/challenge/engine/scoring";
import { EMPTY_DIMENSION_SCORES } from "@/features/challenge/engine/types";

describe("computeChallengeScore", () => {
  it("sums dimensions and adds a capped speed bonus", () => {
    const scores = {
      ...EMPTY_DIMENSION_SCORES,
      innovation: 10,
      culture: 8,
      execution: 6,
      empathy: 4,
      sustainability: 2,
      recognition: 1,
    };
    // 31 dimensions + clamp(60 - 20, 0, 30) = 31 + 30 = 61
    expect(computeChallengeScore(scores, 20_000)).toBe(61);
  });

  it("reduces speed bonus as elapsed time grows", () => {
    const scores = { ...EMPTY_DIMENSION_SCORES, innovation: 10 };
    // 10 + clamp(60 - 50, 0, 30) = 10 + 10 = 20
    expect(computeChallengeScore(scores, 50_000)).toBe(20);
    // 10 + clamp(60 - 90, 0, 30) = 10 + 0 = 10
    expect(computeChallengeScore(scores, 90_000)).toBe(10);
  });
});
