"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { EpicDetailForm } from "../epic/epicDetailForm";
import { FeatureDetailForm } from "../features/featureDetailForm";
import { UserStoryDetailForm } from "../userStory/userStoryDetailForm";
import { REQUIREMENT_KIND_LABELS } from "./requirementsModelConstants";
import { useRequirementsModel } from "./requirementsModelContext";
import type { RequirementNodeData } from "./requirementsModelTypes";
import {
  isEpicNodeData,
  isFeatureNodeData,
  isUserStoryNodeData,
} from "./requirementsModelTypes";

function panelTitle(data: RequirementNodeData): string {
  if (isEpicNodeData(data) || isFeatureNodeData(data) || isUserStoryNodeData(data)) {
    return data.title || REQUIREMENT_KIND_LABELS[data.kind];
  }
  return "—";
}

export function RequirementsDetailPanel() {
  const {
    nodes,
    selectedNodeId,
    panelOpen,
    closePanel,
    updateNodeData,
    suggestedActorsForStory,
  } = useRequirementsModel();

  const node = nodes.find((n) => n.id === selectedNodeId);
  const kind = node?.data.kind;

  return (
    <aside
      className={cn(
        "absolute inset-y-0 right-0 z-20 flex w-[min(100%,22rem)] flex-col border-l border-border bg-background shadow-lg transition-[transform,opacity] duration-300 ease-out",
        panelOpen
          ? "translate-x-0 opacity-100"
          : "pointer-events-none translate-x-full opacity-0"
      )}
      aria-hidden={!panelOpen}
    >
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {kind ? REQUIREMENT_KIND_LABELS[kind] : "Chi tiết"}
          </p>
          <h2 className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {node ? panelTitle(node.data) : "Chọn node trên canvas"}
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={closePanel}
          aria-label="Đóng panel"
        >
          <X className="size-4" />
        </Button>
      </header>

      {node ? (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isEpicNodeData(node.data) ? (
            <EpicDetailForm
              data={node.data}
              onChange={(patch) => updateNodeData(node.id, patch)}
            />
          ) : null}
          {isFeatureNodeData(node.data) ? (
            <FeatureDetailForm
              data={node.data}
              onChange={(patch) => updateNodeData(node.id, patch)}
            />
          ) : null}
          {isUserStoryNodeData(node.data) ? (
            <UserStoryDetailForm
              data={node.data}
              onChange={(patch) => updateNodeData(node.id, patch)}
              suggestedActors={suggestedActorsForStory()}
            />
          ) : null}
        </div>
      ) : (
        <p className="flex-1 px-4 py-6 text-sm text-muted-foreground">
          Click một node trên sơ đồ để chỉnh sửa.
        </p>
      )}

      <footer className="shrink-0 border-t border-border px-4 py-2.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={closePanel}
        >
          Đóng
        </Button>
      </footer>
    </aside>
  );
}
