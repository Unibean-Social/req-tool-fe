import { Layers } from "lucide-react";

import { ProjectWorkbenchPlaceholder } from "../components/projectWorkbenchPlaceholder";

export default function ProjectEpicsPage() {
  return (
    <ProjectWorkbenchPlaceholder
      title="Epic"
      description="Quản lý epic trong dự án sẽ có tại đây."
      icon={Layers}
    />
  );
}
