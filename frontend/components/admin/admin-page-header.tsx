interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
        {eyebrow}
      </p>
      <div className="space-y-2">
        <h1 className="font-display text-3xl text-brand-deep sm:text-4xl">{title}</h1>
        <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
