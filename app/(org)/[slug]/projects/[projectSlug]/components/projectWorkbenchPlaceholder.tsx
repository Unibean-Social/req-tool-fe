import type { LucideIcon } from "lucide-react";

export function ProjectWorkbenchPlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted/80 text-primary">
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="space-y-2">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
