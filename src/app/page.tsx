import { Activity, CalendarCheck2, CalendarDays, Clock3, Plus, Stethoscope, UsersRound } from "lucide-react";

const metrics = [
  { label: "Total patients", value: "—", detail: "Patient records", icon: UsersRound, tone: "teal" },
  { label: "Active doctors", value: "—", detail: "Available care team", icon: Stethoscope, tone: "blue" },
  { label: "Appointments", value: "—", detail: "Scheduled for today", icon: CalendarCheck2, tone: "amber" },
  { label: "Waiting now", value: "—", detail: "Current queue", icon: Clock3, tone: "rose" },
];

export default function DashboardPage() {
  return (
    <section>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><div className="mb-1 text-xs font-semibold uppercase tracking-[.12em] text-teal">Care overview</div><h1 className="font-display text-[27px] font-bold tracking-tight">Good morning, Alex <span className="text-[23px]">☀️</span></h1><p className="mt-1 text-sm text-muted">Your hospital workspace at a glance.</p></div>
        <button type="button" className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-xs font-semibold text-white"><Plus className="h-4 w-4" />New appointment</button>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon, tone }) => <div className="panel p-5" key={label}>
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl" data-tone={tone}><Icon className="h-5 w-5" /></div>
          <div className="text-[12px] text-muted">{label}</div><div className="mt-1 font-display text-[27px] font-bold">{value}</div><div className="mt-1 text-[10px] text-muted">{detail}</div>
        </div>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="text-sm font-bold">Upcoming appointments</h2><p className="mt-0.5 text-[11px] text-muted">Your schedule will appear here</p></div><CalendarDays className="h-4 w-4 text-teal" /></div>
          <div className="flex min-h-[210px] flex-col items-center justify-center px-6 text-center"><span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-mint text-teal"><CalendarCheck2 className="h-5 w-5" /></span><div className="text-xs font-semibold">Your schedule is ready</div><p className="mt-1 max-w-xs text-[11px] leading-5 text-muted">Appointments will show here when they are added.</p></div>
        </div>
        <div className="panel p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold">Doctor availability</h2><p className="mt-0.5 text-[11px] text-muted">Care team overview</p></div><Activity className="h-4 w-4 text-teal" /></div><div className="flex min-h-[160px] items-center justify-center text-center text-[11px] text-muted">Doctors will appear here when added.</div></div>
      </div>
    </section>
  );
}
