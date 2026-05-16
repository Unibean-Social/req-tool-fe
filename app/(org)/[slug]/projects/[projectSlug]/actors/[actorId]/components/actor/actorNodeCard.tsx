"use client";

import { memo } from "react";
import { PersonStanding } from "lucide-react";
import type { Node, NodeProps } from "@/components/ui/react-flow";

import { WorkItemFlowCard } from "../model/requirementWorkItemCard";
import type { ActorNodeData } from "../model/requirementsModelTypes";

type ActorFlowNode = Node<ActorNodeData, "actor">;

function ActorNodeCardComponent({
  data,
  selected,
}: NodeProps<ActorFlowNode>) {
  const title = data.title?.trim() || "—";
  const body =
    data.description?.trim() || data.roleDescription?.trim() || "—";

  return (
    <WorkItemFlowCard
      kind="actor"
      selected={selected}
      sourceBottom
      widthClass="w-[232px]"
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="flex flex-col items-center px-1 pb-1 pt-2 text-center">
        <span
          className="flex size-14 items-center justify-center rounded-full bg-[#1a1d21] ring-1 ring-emerald-500/35"
          aria-hidden
        >
          <PersonStanding
            className="size-8 text-emerald-400"
            strokeWidth={1.75}
          />
        </span>

        <h3 className="mt-3 text-base font-bold leading-snug tracking-tight text-zinc-50">
          {title}
        </h3>

        <p className="mt-2 text-[13px] leading-relaxed text-zinc-300/95">
          {body}
        </p>

        <div
          className="mt-4 h-px w-full max-w-[88%] bg-zinc-600/50"
          aria-hidden
        />
      </div>
    </WorkItemFlowCard>
  );
}

export const ActorNodeCard = memo(ActorNodeCardComponent);
