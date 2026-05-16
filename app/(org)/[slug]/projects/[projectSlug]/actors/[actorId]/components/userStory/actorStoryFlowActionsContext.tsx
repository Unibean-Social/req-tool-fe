"use client";

import { createContext, useContext } from "react";

import type { ActorUserStory } from "./actorUserStoryTypes";

export type ActorStoryFlowActions = {
  onEdit: (story: ActorUserStory) => void;
  onRequestDelete: (story: ActorUserStory) => void;
  onOpenCreate: () => void;
};

const ActorStoryFlowActionsContext =
  createContext<ActorStoryFlowActions | null>(null);

export function ActorStoryFlowActionsProvider({
  value,
  children,
}: {
  value: ActorStoryFlowActions;
  children: React.ReactNode;
}) {
  return (
    <ActorStoryFlowActionsContext.Provider value={value}>
      {children}
    </ActorStoryFlowActionsContext.Provider>
  );
}

export function useActorStoryFlowActions(): ActorStoryFlowActions | null {
  return useContext(ActorStoryFlowActionsContext);
}
