import { ACHIEVEMENT_CATALOG } from "../config/achievements";
import type { ChallengeSessionState } from "@/features/challenge/engine/types";
import type {
  AchievementDefinition,
  ProfileScores,
  SignatureDefinition,
} from "./types";
import { rankProfileDimensions } from "./profile-mapper";

function isFastSession(session: ChallengeSessionState): boolean {
  if (!session.completedAt) return false;
  const elapsed =
    new Date(session.completedAt).getTime() -
    new Date(session.startedAt).getTime();
  const averageMs = elapsed / Math.max(session.answers.length, 1);
  return averageMs < 18_000;
}

function isBalanced(scores: ProfileScores): boolean {
  const values = Object.values(scores);
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  return max > 0 && (max - min) / max < 0.45;
}

export function selectAchievements(
  scores: ProfileScores,
  primary: SignatureDefinition,
  session: ChallengeSessionState,
  catalog: AchievementDefinition[] = ACHIEVEMENT_CATALOG,
  limit = 3,
): AchievementDefinition[] {
  const topDimensions = new Set(rankProfileDimensions(scores).slice(0, 3));
  const selected: AchievementDefinition[] = [];

  const consider = (achievement: AchievementDefinition) => {
    if (selected.length >= limit) return;
    if (selected.some((item) => item.id === achievement.id)) return;
    selected.push(achievement);
  };

  for (const achievement of catalog) {
    if (achievement.rule === "fast_decisions" && isFastSession(session)) {
      consider(achievement);
      continue;
    }
    if (achievement.rule === "balanced_profile" && isBalanced(scores)) {
      consider(achievement);
      continue;
    }
    if (
      achievement.rule === "top_dimension" &&
      achievement.dimension &&
      topDimensions.has(achievement.dimension)
    ) {
      consider(achievement);
    }
  }

  if (selected.length < limit) {
    const primaryMatch = catalog.find(
      (item) => item.dimension === primary.dimension,
    );
    if (primaryMatch) consider(primaryMatch);
  }

  return selected.slice(0, limit);
}
