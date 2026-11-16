import type { LucideIcon } from "lucide-react";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <section>
      <div className="mb-7">
        <div className="mb-1 text-xs font-semibold uppercase tracking-[.12em] text-teal">{eyebrow}</div>
        <h1 className="font-display text-[27px] font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <div className="panel flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-mint text-teal"><Icon className="h-5 w-5" /></span>
        <h2 className="font-display text-base font-bold">{title} workspace</h2>
        <p className="mt-2 max-w-sm text-xs leading-5 text-muted">This screen is scaffolded and ready for the MVP data workflows.</p>
      </div>
    </section>
  );
}
