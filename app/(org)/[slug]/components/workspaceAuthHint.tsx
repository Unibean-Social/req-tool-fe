import { cn } from "@/lib/utils";

/**
 * Gợi ý ngắn sau đăng nhập — dùng chung auth / org workspace.
 */
export function WorkspaceAuthHint({ className }: { className?: string }) {
  return (
    <p className={cn("text-muted-foreground text-xs leading-relaxed", className)}>
      Sau khi đăng nhập, bạn sẽ chọn tổ chức để vào workspace (Dự án, Thành viên).
    </p>
  );
}
