"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { ActorUserStoriesFlow } from "./actorStoriesFlow";
import type { ActorStoryFlowActions } from "./actorStoryFlowActionsContext";
import { ActorUserStoryDeleteDialog } from "./actorUserStoryDeleteDialog";
import { ActorUserStoryFormDialog } from "./actorUserStoryFormDialog";
import type { ActorUserStory } from "./actorUserStoryTypes";
import {
  ACTOR_USER_STORIES_EMPTY_MOCK_ACTOR_ID,
  getActorUserStoriesMockView,
} from "./actorUserStoriesMock";

const pageShellClassName = "flex min-h-0 flex-1 flex-col overflow-hidden";

function ActorUserStoriesPageClientInner({ actorId }: { actorId: string }) {
  const snapshot = useMemo(
    () => getActorUserStoriesMockView(actorId),
    [actorId]
  );

  const [stories, setStories] = useState<ActorUserStory[]>(
    () => snapshot.stories
  );

  const actor = snapshot.actor;

  const isEmptyDemoActor =
    actorId.trim() === ACTOR_USER_STORIES_EMPTY_MOCK_ACTOR_ID;

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingStory, setEditingStory] = useState<ActorUserStory | null>(
    null
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ActorUserStory | null>(
    null
  );

  const openCreate = useCallback(() => {
    setFormMode("create");
    setEditingStory(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((story: ActorUserStory) => {
    setFormMode("edit");
    setEditingStory(story);
    setFormOpen(true);
  }, []);

  const requestDelete = useCallback((story: ActorUserStory) => {
    setDeleteTarget(story);
    setDeleteOpen(true);
  }, []);

  const flowActions: ActorStoryFlowActions = useMemo(
    () => ({
      onEdit: openEdit,
      onRequestDelete: requestDelete,
      onOpenCreate: openCreate,
    }),
    [openCreate, openEdit, requestDelete]
  );

  const onSaveStory = useCallback(
    (story: ActorUserStory) => {
      if (formMode === "create") {
        setStories((prev) => [...prev, story]);
        toast.success("Đã thêm user story (mock)");
      } else {
        setStories((prev) =>
          prev.map((s) => (s.feature_id === story.feature_id ? story : s))
        );
        toast.success("Đã cập nhật user story (mock)");
      }
      setFormOpen(false);
    },
    [formMode]
  );

  const onConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    setStories((prev) =>
      prev.filter((s) => s.feature_id !== deleteTarget.feature_id)
    );
    toast.success("Đã xóa user story (mock)");
    setDeleteTarget(null);
    setDeleteOpen(false);
  }, [deleteTarget]);

  const headerDescription = isEmptyDemoActor
    ? "Actor demo chưa có story — dùng nút Thêm story trên card actor trên sơ đồ để tạo."
    : "Theo dõi các user story liên quan tới actor trong dự án.";

  return (
    <div className={pageShellClassName}>
      <header className="flex shrink-0 flex-col gap-2">
        <h1 className="font-heading min-w-0 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          User stories · {actor.name}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {headerDescription}
        </p>
      </header>

      <div className="mt-4 flex min-h-0 flex-1 flex-col sm:mt-6">
        <ActorUserStoriesFlow
          actor={actor}
          stories={stories}
          flowActions={flowActions}
          className="min-h-0 flex-1"
        />
      </div>

      <ActorUserStoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        actorRef={actor.id}
        initial={formMode === "edit" ? editingStory : null}
        onSave={onSaveStory}
      />

      <ActorUserStoryDeleteDialog
        open={deleteOpen}
        story={deleteTarget}
        onOpenChange={(o) => {
          setDeleteOpen(o);
          if (!o) setDeleteTarget(null);
        }}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}

export function ActorUserStoriesPageClient({ actorId }: { actorId: string }) {
  return <ActorUserStoriesPageClientInner key={actorId} actorId={actorId} />;
}
