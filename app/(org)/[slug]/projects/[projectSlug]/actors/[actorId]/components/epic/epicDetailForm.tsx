"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  DetailFieldRow,
  DetailPanelSection,
} from "../model/requirementDetailPanelUi";
import type { EpicNodeData } from "./epicTypes";
import { EPIC_PRIORITIES, EPIC_STATUSES } from "./epicTypes";

export function EpicDetailForm({
  data,
  onChange,
}: {
  data: EpicNodeData;
  onChange: (patch: Partial<EpicNodeData>) => void;
}) {
  return (
    <div className="space-y-6">
      <DetailPanelSection title="Định danh">
        <DetailFieldRow>
          <div className="space-y-2">
            <Label htmlFor="epic-prefix">Prefix</Label>
            <Input
              id="epic-prefix"
              value={data.prefix}
              onChange={(e) => onChange({ prefix: e.target.value })}
              placeholder="EPIC-01"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="epic-status">Status</Label>
            <Select
              value={data.status}
              onValueChange={(status) =>
                onChange({ status: status as EpicNodeData["status"] })
              }
            >
              <SelectTrigger id="epic-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EPIC_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DetailFieldRow>
        <div className="space-y-2">
          <Label htmlFor="epic-title">Title</Label>
          <Input
            id="epic-title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="epic-priority">Priority</Label>
          <Select
            value={data.priority}
            onValueChange={(priority) =>
              onChange({ priority: priority as EpicNodeData["priority"] })
            }
          >
            <SelectTrigger id="epic-priority" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EPIC_PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DetailPanelSection>

      <DetailPanelSection title="Nội dung">
        <div className="space-y-2">
          <Label htmlFor="epic-desc">Description</Label>
          <Textarea
            id="epic-desc"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="epic-labels">Labels</Label>
          <Input
            id="epic-labels"
            value={data.labels}
            onChange={(e) => onChange({ labels: e.target.value })}
            placeholder="operations, scheduling"
          />
        </div>
      </DetailPanelSection>

      <DetailPanelSection title="Tham chiếu">
        <div className="space-y-2">
          <Label htmlFor="epic-refs">References</Label>
          <Textarea
            id="epic-refs"
            value={data.references}
            onChange={(e) => onChange({ references: e.target.value })}
            rows={2}
          />
        </div>
      </DetailPanelSection>
    </div>
  );
}
