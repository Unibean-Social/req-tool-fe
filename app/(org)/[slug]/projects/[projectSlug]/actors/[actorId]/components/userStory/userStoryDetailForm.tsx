"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { AcceptanceCriterion, UserStoryNodeData } from "./storyTypes";
import { STORY_PRIORITIES, STORY_STATUSES } from "./storyTypes";

export function UserStoryDetailForm({
  data,
  onChange,
  suggestedActors,
}: {
  data: UserStoryNodeData;
  onChange: (patch: Partial<UserStoryNodeData>) => void;
  suggestedActors: string[];
}) {
  const criteria = data.acceptance_criteria;

  const updateCriterion = (
    index: number,
    patch: Partial<AcceptanceCriterion>
  ) => {
    const next = criteria.map((c, i) =>
      i === index ? { ...c, ...patch } : c
    );
    onChange({ acceptance_criteria: next });
  };

  return (
    <div className="space-y-6">
      <DetailPanelSection title="Định danh">
        <DetailFieldRow>
          <div className="space-y-2">
            <Label htmlFor="story-prefix">Prefix</Label>
            <Input
              id="story-prefix"
              value={data.prefix}
              onChange={(e) => onChange({ prefix: e.target.value })}
              placeholder="US-01"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="story-status">Status</Label>
            <Select
              value={data.status}
              onValueChange={(status) =>
                onChange({ status: status as UserStoryNodeData["status"] })
              }
            >
              <SelectTrigger id="story-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STORY_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DetailFieldRow>
        <div className="space-y-2">
          <Label htmlFor="story-title">Title</Label>
          <Input
            id="story-title"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <DetailFieldRow>
          <div className="space-y-2">
            <Label htmlFor="story-priority">Priority</Label>
            <Select
              value={data.priority}
              onValueChange={(priority) =>
                onChange({ priority: priority as UserStoryNodeData["priority"] })
              }
            >
              <SelectTrigger id="story-priority" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STORY_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="story-points">Story points</Label>
            <Input
              id="story-points"
              type="number"
              min={0}
              value={data.story_points}
              onChange={(e) =>
                onChange({ story_points: Number(e.target.value) || 0 })
              }
            />
          </div>
        </DetailFieldRow>
      </DetailPanelSection>

      <DetailPanelSection
        title="Story"
        hint="Khớp Action / Goal trên card canvas."
      >
        <div className="space-y-2">
          <Label htmlFor="story-actor">Actor ref</Label>
          <Input
            id="story-actor"
            value={data.actor_ref}
            onChange={(e) => onChange({ actor_ref: e.target.value })}
            placeholder={suggestedActors[0] ?? "Actor liên kết"}
            list="story-actor-suggestions"
          />
          <datalist id="story-actor-suggestions">
            {suggestedActors.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-action">Action text</Label>
          <Textarea
            id="story-action"
            value={data.action_text}
            onChange={(e) => onChange({ action_text: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-goal">Goal text</Label>
          <Textarea
            id="story-goal"
            value={data.goal_text}
            onChange={(e) => onChange({ goal_text: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-desc">Description</Label>
          <Textarea
            id="story-desc"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="story-labels">Labels</Label>
          <Input
            id="story-labels"
            value={data.labels}
            onChange={(e) => onChange({ labels: e.target.value })}
          />
        </div>
      </DetailPanelSection>

      <DetailPanelSection title="Acceptance criteria">
        <ul className="space-y-2">
          {criteria.map((item, i) => (
            <li key={item.id} className="flex items-start gap-2">
              <Checkbox
                className="mt-2 shrink-0"
                checked={item.done}
                onCheckedChange={(checked) =>
                  updateCriterion(i, { done: checked === true })
                }
              />
              <Input
                className="min-w-0 flex-1"
                value={item.text}
                onChange={(e) => updateCriterion(i, { text: e.target.value })}
                placeholder={`Tiêu chí ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="size-8 shrink-0"
                onClick={() =>
                  onChange({
                    acceptance_criteria: criteria.filter((_, j) => j !== i),
                  })
                }
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-0 text-muted-foreground hover:text-foreground"
          onClick={() =>
            onChange({
              acceptance_criteria: [
                ...criteria,
                { id: crypto.randomUUID(), text: "", done: false },
              ],
            })
          }
        >
          <Plus className="size-3.5" />
          Thêm tiêu chí
        </Button>
      </DetailPanelSection>
    </div>
  );
}
