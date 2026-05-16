export const FEATURE_STATUSES = ["draft", "active", "done", "archived"] as const;
export type FeatureStatus = (typeof FEATURE_STATUSES)[number];

export const FEATURE_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type FeaturePriority = (typeof FEATURE_PRIORITIES)[number];

/** Shape khớp response API Feature. */
export type FeatureRecord = {
  epic_id: string;
  prefix: string;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: FeaturePriority;
  labels: string;
  nfr_note: string;
  references: string;
  warnings: string[];
  created_at: string;
  updated_at: string;
};

export type FeatureNodeData = FeatureRecord & {
  kind: "feature";
  collapsed: boolean;
};

export function createDefaultFeatureRecord(epicId: string): FeatureRecord {
  const now = new Date().toISOString();
  return {
    epic_id: epicId,
    prefix: "",
    title: "Feature mới",
    description: "",
    status: "draft",
    priority: "low",
    labels: "",
    nfr_note: "",
    references: "",
    warnings: [],
    created_at: now,
    updated_at: now,
  };
}
