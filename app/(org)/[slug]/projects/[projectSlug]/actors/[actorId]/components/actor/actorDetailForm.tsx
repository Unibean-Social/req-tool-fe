"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { DetailPanelSection } from "../model/requirementDetailPanelUi";
import type { ActorNodeData } from "../model/requirementsModelTypes";

export function ActorDetailForm({
  data,
  onChange,
}: {
  data: ActorNodeData;
  onChange: (patch: Partial<ActorNodeData>) => void;
}) {
  return (
    <div className="space-y-6">
      <DetailPanelSection title="Thông tin">
        <div className="space-y-2">
          <Label htmlFor="actor-title">Tên</Label>
          <Input
            id="actor-title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="actor-desc">Mô tả ngắn</Label>
          <Textarea
            id="actor-desc"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={2}
          />
        </div>
      </DetailPanelSection>
      <DetailPanelSection title="Vai trò">
        <div className="space-y-2">
          <Label htmlFor="actor-role">Role</Label>
          <Textarea
            id="actor-role"
            value={data.roleDescription ?? ""}
            onChange={(e) => onChange({ roleDescription: e.target.value })}
            rows={3}
          />
        </div>
      </DetailPanelSection>
    </div>
  );
}
