export const EPIC_STATUSES = ["draft", "active", "done", "archived"] as const;
export type EpicStatus = (typeof EPIC_STATUSES)[number];

export const EPIC_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type EpicPriority = (typeof EPIC_PRIORITIES)[number];

/** Shape khớp response API Epic. */
export type EpicRecord = {
  project_id: string;
  prefix: string;
  title: string;
  description: string;
  status: EpicStatus;
  priority: EpicPriority;
  labels: string;
  references: string;
  created_at: string;
  updated_at: string;
};

export type EpicNodeData = EpicRecord & {
  kind: "epic";
  collapsed: boolean;
};

export function createDefaultEpicRecord(projectId: string): EpicRecord {
  const now = new Date().toISOString();
  return {
    project_id: projectId,
    prefix: "",
    title: "Epic mới",
    description: "",
    status: "draft",
    priority: "low",
    labels: "",
    references: "",
    created_at: now,
    updated_at: now,
  };
}
