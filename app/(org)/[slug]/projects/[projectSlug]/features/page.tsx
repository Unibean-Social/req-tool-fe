import { Sparkles } from "lucide-react";

import { ProjectWorkbenchPlaceholder } from "../components/projectWorkbenchPlaceholder";

export default function ProjectFeaturesPage() {
  return (
    <ProjectWorkbenchPlaceholder
      title="Tính năng"
      description="Quản lý tính năng trong dự án đang được phát triển."
      icon={Sparkles}
    />
  );
}
