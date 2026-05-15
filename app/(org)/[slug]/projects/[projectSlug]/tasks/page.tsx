import { ListTodo } from "lucide-react";

import { ProjectWorkbenchPlaceholder } from "../components/projectWorkbenchPlaceholder";

export default function ProjectTasksPage() {
  return (
    <ProjectWorkbenchPlaceholder
      title="Nhiệm vụ"
      description="Theo dõi nhiệm vụ trong dự án sẽ có sau."
      icon={ListTodo}
    />
  );
}
