import type { ReactNode } from "react";

import { OrgAppHeader } from "./components/orgAppHeader";

export default function OrgLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden">
      <OrgAppHeader />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
