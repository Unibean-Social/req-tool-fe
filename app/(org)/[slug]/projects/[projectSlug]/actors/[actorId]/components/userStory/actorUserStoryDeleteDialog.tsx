"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { ActorUserStory } from "./actorUserStoryTypes";

type ActorUserStoryDeleteDialogProps = {
  open: boolean;
  story: ActorUserStory | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ActorUserStoryDeleteDialog({
  open,
  story,
  onOpenChange,
  onConfirm,
}: ActorUserStoryDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa user story?</AlertDialogTitle>
          <AlertDialogDescription>
            {story ? (
              <>
                «{story.title}» sẽ bị gỡ khỏi sơ đồ (mock). Bạn có thể thêm
                lại bất cứ lúc nào.
              </>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={!story}
            onClick={onConfirm}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
