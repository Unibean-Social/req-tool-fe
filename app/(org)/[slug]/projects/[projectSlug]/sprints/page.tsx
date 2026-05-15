import { CalendarDays } from "lucide-react";

import { ProjectWorkbenchPlaceholder } from "../components/projectWorkbenchPlaceholder";

export default function ProjectSprintsPage() {
  return (
    <ProjectWorkbenchPlaceholder
      title="Sprint"
      description="Lập kế hoạch sprint trong dự án sẽ được tích hợp sau."
      icon={CalendarDays}
    />
  );
}
