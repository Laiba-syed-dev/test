"use client";

import { useMemo, useState } from "react";
import { ListFilter, Search } from "lucide-react";
import { AppointmentStatusControl } from "@/components/appointment-status-control";
import type { AppointmentStatus } from "@/lib/types";

export interface AppointmentTableRow {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: AppointmentStatus;
}

const statusOptions: Array<"All statuses" | AppointmentStatus> = ["All statuses", "Scheduled", "Completed", "Cancelled"];
const avatarStyles = ["bg-[#FCEBEA] text-[#C76B61]", "bg-[#EAF0FC] text-blue", "bg-[#FFF1DE] text-amber", "bg-[#F2EAF6] text-[#986BB1]", "bg-[#E8F6F3] text-teal"];

function initials(name: string) {
  return name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export function AppointmentsTable({ appointments }: { appointments: AppointmentTableRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All statuses" | AppointmentStatus>("All statuses");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return appointments.filter((appointment) => {
      const matchesText = !normalized || [
        appointment.patientName,
        appointment.patientPhone,
        appointment.doctorName,
        appointment.specialization,
        appointment.notes,
      ].join(" ").toLowerCase().includes(normalized);
      return matchesText && (status === "All statuses" || appointment.status === status);
    });
  }, [appointments, query, status]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <label className="relative min-w-[220px] flex-1 sm:max-w-[340px]"><span className="sr-only">Search appointments</span><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-line py-2 pl-9 pr-3 text-xs outline-none focus:border-teal" placeholder="Search patient or doctor..." /></label>
        <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-muted"><ListFilter className="h-3.5 w-3.5" /><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value as "All statuses" | AppointmentStatus)} className="bg-transparent outline-none">{statusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-[#FAFCFC]"><tr className="text-[10px] font-bold uppercase tracking-[.1em] text-muted"><th scope="col" className="px-5 py-3">Patient</th><th scope="col" className="px-4 py-3">Doctor</th><th scope="col" className="px-4 py-3">Date &amp; time</th><th scope="col" className="px-4 py-3">Notes</th><th scope="col" className="px-4 py-3">Status</th></tr></thead>
          <tbody className="text-xs">
            {filtered.map((appointment, index) => <tr key={appointment.id} className="border-t border-line align-middle">
              <td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`avatar ${avatarStyles[index % avatarStyles.length]}`}>{initials(appointment.patientName)}</span><span><span className="block font-bold">{appointment.patientName}</span><span className="mt-0.5 block text-[10px] text-muted">{appointment.patientPhone}</span></span></div></td>
              <td className="px-4 py-4"><span className="block font-semibold">{appointment.doctorName}</span><span className="text-[10px] text-muted">{appointment.specialization}</span></td>
              <td className="whitespace-nowrap px-4 py-4"><span className="block font-semibold">{appointment.appointmentDate}</span><span className="text-[10px] text-muted">{appointment.appointmentTime}</span></td>
              <td className="max-w-[190px] px-4 py-4"><span className="block truncate text-muted" title={appointment.notes || "No notes"}>{appointment.notes || "No notes"}</span></td>
              <td className="px-4 py-4"><AppointmentStatusControl appointmentId={appointment.id} initialStatus={appointment.status} /></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line px-5 py-3 text-[11px] text-muted">Showing <b className="text-ink">{filtered.length}</b> of <b className="text-ink">{appointments.length}</b> appointments</div>
      {filtered.length === 0 && <div className="border-t border-line px-5 py-10 text-center"><p className="text-xs font-semibold">{appointments.length ? "No appointments match your filters" : "No appointments yet"}</p><p className="mt-1 text-[11px] text-muted">{appointments.length ? "Try another search or status filter." : "Book an appointment to add the first visit to the schedule."}</p></div>}
    </div>
  );
}
