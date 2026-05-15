import { LayoutDashboard } from "lucide-react";

import { ProjectWorkbenchPlaceholder } from "../components/projectWorkbenchPlaceholder";

export default function ProjectDashboardPage() {
  return (
    <ProjectWorkbenchPlaceholder
      title="Bảng điều khiển"
      description="Tổng quan dự án sẽ hiển thị tại đây."
      icon={LayoutDashboard}
    />
  );
}
