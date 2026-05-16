export type StoryPriority = "low" | "medium" | "high" | "critical";

/** Trạng thái từ API (mở rộng khi backend bổ sung). */
export type StoryStatus = "draft" | "in_progress" | "done" | "cancelled" | string;

/**
 * User story / feature gắn actor — khớp payload GET (và form mock).
 * `labels` trong UI luôn là `string[]`; API có thể trả string → dùng `normalizeLabelsFromApi`.
 */
export type ActorUserStory = {
  id: string;
  feature_id: string;
  prefix: string;
  title: string;
  description: string;
  actor_ref: string;
  /** Nhiều mục: mỗi dòng một hành động (xuống dòng trong form). */
  action_text: string;
  /** Nhiều mục: mỗi dòng một mục tiêu. */
  goal_text: string;
  status: StoryStatus;
  priority: StoryPriority;
  labels: string[];
  references: string;
  story_points: number;
  sprint_id: string | null;
  acceptance_criteria: string[];
  created_at: string;
  updated_at: string;
};

/**
 * Mỗi dòng không rỗng = một mục action/goal trên thẻ (đánh số tự động).
 */
export function storyLinesFromMultiline(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function normalizeLabelsFromApi(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeStoryPriority(value: unknown): StoryPriority {
  const s = String(value ?? "").toLowerCase();
  if (s === "low" || s === "medium" || s === "high" || s === "critical") {
    return s;
  }
  return "medium";
}

function normalizeAcceptanceCriteria(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((x) => typeof x === "string" || typeof x === "number")
    .map((x) => String(x).trim())
    .filter(Boolean);
}

/**
 * Map một object (JSON API) sang `ActorUserStory` — dùng khi nối GET features/stories.
 */
export function normalizeActorUserStoryFromApi(
  raw: Record<string, unknown>
): ActorUserStory {
  let feature_id = String(raw.feature_id ?? "").trim();
  let id = String(raw.id ?? "").trim();
  if (!feature_id && !id) {
    const g = crypto.randomUUID();
    feature_id = g;
    id = g;
  } else if (!id) {
    id = feature_id;
  } else if (!feature_id) {
    feature_id = id;
  }
  const now = new Date().toISOString();
  return {
    id,
    feature_id,
    prefix: String(raw.prefix ?? ""),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    actor_ref: String(raw.actor_ref ?? ""),
    action_text: String(raw.action_text ?? ""),
    goal_text: String(raw.goal_text ?? ""),
    status: String(raw.status ?? "draft") as StoryStatus,
    priority: normalizeStoryPriority(raw.priority),
    labels: normalizeLabelsFromApi(raw.labels),
    references: String(raw.references ?? ""),
    story_points: Number.isFinite(Number(raw.story_points))
      ? Number(raw.story_points)
      : 0,
    sprint_id:
      raw.sprint_id == null || raw.sprint_id === ""
        ? null
        : String(raw.sprint_id),
    acceptance_criteria: normalizeAcceptanceCriteria(raw.acceptance_criteria),
    created_at: String(raw.created_at ?? now),
    updated_at: String(raw.updated_at ?? now),
  };
}
