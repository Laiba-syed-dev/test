import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  Clock3,
  Plus,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { PageHeading } from "@/components/page-heading";
import { PageLoading } from "@/components/page-loading";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { getDashboardOverview } from "@/lib/data";
import type { DashboardOverview } from "@/lib/types";

const numberFormat = new Intl.NumberFormat("en-US");
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

export default function DashboardPage() {
  return <Suspense fallback={<PageLoading dashboard />}><DashboardContent /></Suspense>;
}

async function DashboardContent() {
  await connection();
  let overview: DashboardOverview | undefined;
  let loadError = false;

  try {
    overview = await getDashboardOverview();
  } catch (error) {
    console.error("Unable to load the dashboard from MongoDB:", error);
    loadError = true;
  }

  const summary = overview?.summary;

  return (
    <section>
      <PageHeading
        eyebrow={dateFormat.format(new Date())}
        title={<>Good morning, Alex <span className="hidden text-[23px] sm:inline" aria-hidden="true">☀️</span></>}
        description="Here’s what’s happening at your hospital today."
        action={<Link href="/appointments" className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#11776f]"><Plus className="h-4 w-4" />New appointment</Link>}
      />

      {loadError && (
        <div role="alert" className="mb-5 rounded-xl border border-[#F2D7B1] bg-[#FFF9F0] px-4 py-3 text-xs text-[#8A5B1E]">
          Dashboard data could not be loaded. Check that `MONGODB_URI` is set and MongoDB is reachable.
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total patients" value={summary ? numberFormat.format(summary.totalPatients) : "—"} detail="Patient records" icon={UsersRound} tone="teal" />
        <StatCard label="Active doctors" value={summary ? numberFormat.format(summary.activeDoctors) : "—"} detail="Marked available" icon={Stethoscope} tone="blue" />
        <StatCard label="Appointments today" value={summary ? numberFormat.format(summary.todaysAppointments) : "—"} detail="Excludes cancelled visits" icon={CalendarCheck2} tone="amber" />
      </div>

      {overview && !overview.hasRecords && (
        <div className="panel mb-6 flex flex-wrap items-center justify-between gap-4 border-dashed p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-teal"><Activity className="h-5 w-5" /></span>
            <div><h2 className="text-sm font-bold">Your workspace is ready</h2><p className="mt-1 max-w-xl text-xs leading-5 text-muted">There are no doctors, patients, or appointments yet. Add your care team and patient records to get started.</p></div>
          </div>
          <div className="flex gap-2"><Link href="/doctors" className="rounded-lg border border-line px-3 py-2 text-[11px] font-semibold hover:bg-canvas">Add a doctor</Link><Link href="/patients" className="rounded-lg bg-teal px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#11776f]">Add a patient</Link></div>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div><h2 className="text-sm font-bold">Today’s appointments</h2><p className="mt-0.5 text-[11px] text-muted">Scheduled visits, in time order</p></div>
            <Link href="/appointments" className="flex items-center gap-1 text-xs font-semibold text-teal">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          {overview?.todaysAppointments.length ? (
            <div className="divide-y divide-line">
              {overview.todaysAppointments.map((appointment, index) => (
                <div key={appointment._id.toHexString()} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-[58px] text-center"><div className="text-xs font-bold">{timeFormat.format(appointment.appointment_date)}</div></div>
                  <div className={`h-9 w-0.5 rounded ${["bg-teal", "bg-blue", "bg-amber", "bg-rose", "bg-[#986BB1]"][index % 5]}`} />
                  <div className="min-w-0 flex-1"><div className="truncate text-xs font-bold">{appointment.patient.name}</div><div className="truncate text-[10px] text-muted">{appointment.doctor.specialization} · {appointment.doctor.name}</div></div>
                  <StatusBadge status={appointment.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[170px] flex-col items-center justify-center px-6 text-center">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-canvas text-muted"><CalendarDays className="h-5 w-5" /></span>
              <div className="text-xs font-semibold">No appointments today</div>
              <p className="mt-1 max-w-xs text-[11px] leading-5 text-muted">When visits are scheduled for today, they’ll appear here.</p>
            </div>
          )}
          {overview?.todaysAppointments.length ? <div className="border-t border-line px-5 py-3 text-center"><Link href="/appointments" className="text-[11px] font-semibold text-muted">Open appointment schedule <span className="text-teal">→</span></Link></div> : null}
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold">Doctor availability</h2><p className="mt-0.5 text-[11px] text-muted">Currently marked available</p></div><Link href="/doctors" className="text-[11px] font-semibold text-teal">All doctors</Link></div>
          {overview?.availableDoctors.length ? (
            <div className="space-y-3.5">
              {overview.availableDoctors.map((doctor, index) => {
                const initials = doctor.name.replace(/^Dr\.\s*/i, "").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
                const avatarStyles = ["bg-[#E8F6F3] text-teal", "bg-[#EDF1FB] text-blue", "bg-[#FFF4E6] text-amber", "bg-[#FDEDEE] text-rose"];
                return <div key={doctor._id.toHexString()} className="flex items-center gap-3"><div className={`avatar ${avatarStyles[index % avatarStyles.length]}`}>{initials}</div><div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{doctor.name}</div><div className="text-[10px] text-muted">{doctor.specialization}</div></div><StatusBadge status={doctor.availability_status} /></div>;
              })}
            </div>
          ) : (
            <div className="flex min-h-[150px] flex-col items-center justify-center text-center"><span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-canvas text-muted"><Clock3 className="h-5 w-5" /></span><div className="text-xs font-semibold">No available doctors</div><p className="mt-1 max-w-[230px] text-[11px] leading-5 text-muted">Doctors marked available will appear here.</p></div>
          )}
        </div>
      </div>
    </section>
  );
}
