"use client";

import {
  orgChartBezierEdgeStyle,
  type Edge,
  type Node,
} from "@/components/ui/react-flow";

import type { ActorUserStory } from "./actorUserStoryTypes";

const L = {
  hubW: 240,
  hubH: 200,
  storyW: 352,
  hGap: 24,
  vGap: 100,
  centerX: 420,
} as const;

export type ActorHubFlowData = {
  actorId: string;
  name: string;
  roleDescription: string;
};

export type UserStoryFlowNodeData = ActorUserStory & {
  storyNodeId: string;
};

const HUB_ID = "actor-hub";

export function buildActorUserStoriesFlowGraph(
  actor: { id: string; name: string; roleDescription: string },
  stories: ActorUserStory[]
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const ownerY = 36;
  const cx = L.centerX;

  nodes.push({
    id: HUB_ID,
    type: "actorHub",
    position: { x: cx - L.hubW / 2, y: ownerY },
    data: {
      actorId: actor.id,
      name: actor.name,
      roleDescription: actor.roleDescription,
    } satisfies ActorHubFlowData,
  });

  if (stories.length === 0) {
    return { nodes, edges };
  }

  const storyY = ownerY + L.hubH + L.vGap;
  const n = stories.length;
  const rowW = n * L.storyW + Math.max(0, n - 1) * L.hGap;
  const rowCx = Math.max(cx, rowW / 2 + 40);
  const startX = rowCx - rowW / 2;

  stories.forEach((story, i) => {
    const storyNodeId = `story-${story.feature_id}`;
    nodes.push({
      id: storyNodeId,
      type: "userStory",
      position: {
        x:
          n === 1
            ? rowCx - L.storyW / 2
            : startX + i * (L.storyW + L.hGap),
        y: storyY,
      },
      data: {
        ...story,
        storyNodeId,
      } satisfies UserStoryFlowNodeData,
    });

    edges.push({
      id: `e-hub-${storyNodeId}`,
      source: HUB_ID,
      target: storyNodeId,
      type: "default",
      style: orgChartBezierEdgeStyle,
    });
  });

  return { nodes, edges };
}
