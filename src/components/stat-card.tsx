import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "teal" | "blue" | "amber";
}) {
  return (
    <article className="panel p-5">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl" data-tone={tone}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="text-[12px] text-muted">{label}</div>
      <div className="mt-1 font-display text-[27px] font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-[10px] text-muted">{detail}</div>
    </article>
  );
}
