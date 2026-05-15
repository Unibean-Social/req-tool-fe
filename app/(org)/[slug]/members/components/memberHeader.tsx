export type MemberHeaderProps = {
  title?: string;
  description?: string;
};

export function MemberHeader({
  title = "Thành viên",
  description = "Xem nhóm trưởng, thành viên và mối liên hệ trong tổ chức.",
}: MemberHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
    </header>
  );
}
