import { MessageCircle } from "lucide-react";

import { ProjectWorkbenchPlaceholder } from "../components/projectWorkbenchPlaceholder";

export default function ProjectExchangePage() {
  return (
    <ProjectWorkbenchPlaceholder
      title="Trao đổi"
      description="Kênh trao đổi trong dự án đang được xây dựng."
      icon={MessageCircle}
    />
  );
}
