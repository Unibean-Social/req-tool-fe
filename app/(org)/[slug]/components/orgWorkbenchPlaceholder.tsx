import type { LucideIcon } from "lucide-react";

type OrgWorkbenchPlaceholderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function OrgWorkbenchPlaceholder({
  title,
  description,
  icon: Icon,
}: OrgWorkbenchPlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 rounded-xl border border-border/70 bg-card/40 p-6 sm:p-8">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted/80 text-primary">
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="space-y-2">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
