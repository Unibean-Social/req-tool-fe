import type { ReactNode } from "react";

import { OrgLayoutShell } from "./components/orgLayoutShell";

export default function OrgLayout({ children }: { children: ReactNode }) {
  return <OrgLayoutShell>{children}</OrgLayoutShell>;
}
