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
import type { FeatureNodeData } from "./featureTypes";
import { FEATURE_PRIORITIES, FEATURE_STATUSES } from "./featureTypes";

export function FeatureDetailForm({
  data,
  onChange,
}: {
  data: FeatureNodeData;
  onChange: (patch: Partial<FeatureNodeData>) => void;
}) {
  return (
    <div className="space-y-6">
      <DetailPanelSection title="Định danh">
        <DetailFieldRow>
          <div className="space-y-2">
            <Label htmlFor="feature-prefix">Prefix</Label>
            <Input
              id="feature-prefix"
              value={data.prefix}
              onChange={(e) => onChange({ prefix: e.target.value })}
              placeholder="FEAT-01"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="feature-status">Status</Label>
            <Select
              value={data.status}
              onValueChange={(status) =>
                onChange({ status: status as FeatureNodeData["status"] })
              }
            >
              <SelectTrigger id="feature-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FEATURE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DetailFieldRow>
        <div className="space-y-2">
          <Label htmlFor="feature-title">Title</Label>
          <Input
            id="feature-title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feature-priority">Priority</Label>
          <Select
            value={data.priority}
            onValueChange={(priority) =>
              onChange({ priority: priority as FeatureNodeData["priority"] })
            }
          >
            <SelectTrigger id="feature-priority" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURE_PRIORITIES.map((p) => (
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
          <Label htmlFor="feature-desc">Description</Label>
          <Textarea
            id="feature-desc"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feature-nfr">NFR note</Label>
          <Textarea
            id="feature-nfr"
            value={data.nfr_note}
            onChange={(e) => onChange({ nfr_note: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feature-labels">Labels</Label>
          <Input
            id="feature-labels"
            value={data.labels}
            onChange={(e) => onChange({ labels: e.target.value })}
          />
        </div>
      </DetailPanelSection>

      <DetailPanelSection title="Tham chiếu">
        <div className="space-y-2">
          <Label htmlFor="feature-refs">References</Label>
          <Textarea
            id="feature-refs"
            value={data.references}
            onChange={(e) => onChange({ references: e.target.value })}
            rows={2}
          />
        </div>
      </DetailPanelSection>
    </div>
  );
}
