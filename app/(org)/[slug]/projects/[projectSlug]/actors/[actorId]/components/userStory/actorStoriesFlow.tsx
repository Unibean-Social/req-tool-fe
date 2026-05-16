"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import {
  Background,
  defaultReactFlowCanvasProps,
  FitViewOnGraphChange,
  reactFlowBackgroundProps,
  reactFlowCanvasClassName,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
} from "@/components/ui/react-flow";
import { cn } from "@/lib/utils";

import {
  ActorStoryFlowActionsProvider,
  type ActorStoryFlowActions,
} from "./actorStoryFlowActionsContext";
import { buildActorUserStoriesFlowGraph } from "./actorStoriesFlowGraph";
import { ActorHubCard, UserStoryCard } from "./actorStoriesFlowNodes";
import type { ActorUserStory } from "./actorUserStoryTypes";

function ActorUserStoriesFlowInner({
  actor,
  stories,
  flowActions,
}: {
  actor: { id: string; name: string; roleDescription: string };
  stories: ActorUserStory[];
  flowActions: ActorStoryFlowActions;
}) {
  const nodeTypes = useMemo(
    () => ({
      actorHub: ActorHubCard,
      userStory: UserStoryCard,
    }),
    []
  );

  const graphKey = useMemo(
    () => `${actor.id}:${stories.map((s) => s.feature_id).join("|")}`,
    [actor.id, stories]
  );

  const { nodes: layoutNodes, edges } = useMemo(
    () => buildActorUserStoriesFlowGraph(actor, stories),
    [actor, stories]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
  const nodesRef = useRef(nodes);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    const { nodes: built } = buildActorUserStoriesFlowGraph(actor, stories);
    setNodes(built);
  }, [graphKey, actor, stories, setNodes]);

  const onNodeDragStop = useCallback(() => {
    /* có thể lưu localStorage theo project+actor tương tự membersFlow */
  }, []);

  return (
    <ActorStoryFlowActionsProvider value={flowActions}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        {...defaultReactFlowCanvasProps}
        nodesDraggable
        className={cn(
          reactFlowCanvasClassName,
          "h-full min-h-0 [&_.react-flow__attribution]:hidden"
        )}
      >
        <Background {...reactFlowBackgroundProps} />
        <FitViewOnGraphChange graphKey={graphKey} />
      </ReactFlow>
    </ActorStoryFlowActionsProvider>
  );
}

export function ActorUserStoriesFlow({
  actor,
  stories,
  flowActions,
  className,
}: {
  actor: { id: string; name: string; roleDescription: string };
  stories: ActorUserStory[];
  flowActions: ActorStoryFlowActions;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-105 min-w-0 flex-1 flex-col rounded-xl border border-border/80 bg-muted/15 shadow-inner",
        className
      )}
    >
      <ReactFlowProvider>
        <div className="h-full min-h-105 min-w-0 w-full">
          <ActorUserStoriesFlowInner
            actor={actor}
            stories={stories}
            flowActions={flowActions}
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
}
