import type { ReactNode } from "react";

/** Khóa chiều cao theo flex — không scroll trang; chỉ scroll trong panel/sơ đồ nếu cần. */
export default function OrgMembersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {children}
    </div>
  );
}
