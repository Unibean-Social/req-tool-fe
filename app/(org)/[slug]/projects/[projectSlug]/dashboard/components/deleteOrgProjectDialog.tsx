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

type DeleteOrgProjectDialogProps = {
  open: boolean;
  projectName: string;
  deletePending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void | Promise<void>;
};

export function DeleteOrgProjectDialog({
  open,
  projectName,
  deletePending,
  onOpenChange,
  onConfirmDelete,
}: DeleteOrgProjectDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa dự án?</AlertDialogTitle>
          <AlertDialogDescription>
            Dự án{" "}
            <span className="font-medium text-foreground">«{projectName}»</span>{" "}
            và toàn bộ dữ liệu liên quan sẽ bị xóa vĩnh viễn. Bạn không thể hoàn
            tác thao tác này.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deletePending}
            onClick={() => void onConfirmDelete()}
          >
            {deletePending ? "Đang xóa…" : "Xóa dự án"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
