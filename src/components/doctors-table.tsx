"use client";

import { useMemo, useState } from "react";
import { ListFilter, Search } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { AvailabilityStatus } from "@/lib/types";

export interface DoctorTableRow {
  id: string;
  name: string;
  specialization: string;
  availability_status: AvailabilityStatus;
  created_at: string;
}

function initials(name: string) {
  return name.replace(/^Dr\.\s*/i, "").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

const avatarStyles = ["bg-[#E8F6F3] text-teal", "bg-[#EDF1FB] text-blue", "bg-[#FFF4E6] text-amber", "bg-[#FDEDEE] text-rose", "bg-[#F2EAF6] text-[#986BB1]"];

export function DoctorsTable({ doctors }: { doctors: DoctorTableRow[] }) {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<"All" | AvailabilityStatus>("All");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesText = !normalized || `${doctor.name} ${doctor.specialization}`.toLowerCase().includes(normalized);
      const matchesAvailability = availability === "All" || doctor.availability_status === availability;
      return matchesText && matchesAvailability;
    });
  }, [doctors, query, availability]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <label className="relative min-w-[220px] flex-1 sm:max-w-[310px]"><span className="sr-only">Search doctors</span><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-line py-2 pl-9 pr-3 text-xs outline-none focus:border-teal" placeholder="Search doctors..." /></label>
        <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-muted"><ListFilter className="h-3.5 w-3.5" /><span className="sr-only">Filter by availability</span><select value={availability} onChange={(event) => setAvailability(event.target.value as "All" | AvailabilityStatus)} className="bg-transparent outline-none"><option value="All">All availability</option><option value="Available">Available</option><option value="Unavailable">Unavailable</option></select></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead className="bg-[#FAFCFC]"><tr className="text-[10px] font-bold uppercase tracking-[.1em] text-muted"><th scope="col" className="px-5 py-3">Doctor</th><th scope="col" className="px-4 py-3">Specialization</th><th scope="col" className="px-4 py-3">Availability</th><th scope="col" className="px-5 py-3">Added</th></tr></thead>
          <tbody className="text-xs">
            {filtered.map((doctor, index) => <tr key={doctor.id} className="border-t border-line">
              <td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`avatar ${avatarStyles[index % avatarStyles.length]}`}>{initials(doctor.name)}</span><span><span className="block font-bold">{doctor.name}</span><span className="mt-0.5 block text-[10px] text-muted">ID · {doctor.id.slice(-6).toUpperCase()}</span></span></div></td>
              <td className="px-4 py-4">{doctor.specialization}</td>
              <td className="px-4 py-4"><StatusBadge status={doctor.availability_status} /></td>
              <td className="px-5 py-4 text-muted">{doctor.created_at}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line px-5 py-3 text-[11px] text-muted">Showing <b className="text-ink">{filtered.length}</b> of <b className="text-ink">{doctors.length}</b> doctors</div>
      {filtered.length === 0 && <div className="border-t border-line px-5 py-10 text-center"><p className="text-xs font-semibold">{doctors.length ? "No doctors match your filters" : "No doctors added yet"}</p><p className="mt-1 text-[11px] text-muted">{doctors.length ? "Try a different name or availability filter." : "Add a doctor to start building your care team."}</p></div>}
    </div>
  );
}
