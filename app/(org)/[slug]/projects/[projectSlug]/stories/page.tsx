import { BookOpen } from "lucide-react";

import { ProjectWorkbenchPlaceholder } from "../components/projectWorkbenchPlaceholder";

export default function ProjectStoriesPage() {
  return (
    <ProjectWorkbenchPlaceholder
      title="Câu chuyện"
      description="User story và backlog dự án sẽ hiển thị tại đây."
      icon={BookOpen}
    />
  );
}
