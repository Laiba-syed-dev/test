"use client";

import { useMemo, useState } from "react";
import { ListFilter, Search } from "lucide-react";
import type { Gender } from "@/lib/types";

export interface PatientTableRow {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  medical_history: string;
  created_at: string;
}

const avatarStyles = ["bg-[#FCEBEA] text-[#C76B61]", "bg-[#EAF0FC] text-blue", "bg-[#FFF1DE] text-amber", "bg-[#F2EAF6] text-[#986BB1]", "bg-[#E8F6F3] text-teal"];

function initials(name: string) {
  return name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

export function PatientsTable({ patients }: { patients: PatientTableRow[] }) {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<"All" | Gender>("All");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return patients.filter((patient) => {
      const matchesText = !normalized || `${patient.name} ${patient.phone} ${patient.medical_history}`.toLowerCase().includes(normalized);
      return matchesText && (gender === "All" || patient.gender === gender);
    });
  }, [patients, query, gender]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
        <label className="relative min-w-[220px] flex-1 sm:max-w-[340px]"><span className="sr-only">Search patients</span><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-line py-2 pl-9 pr-3 text-xs outline-none focus:border-teal" placeholder="Search name, phone, or history..." /></label>
        <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-muted"><ListFilter className="h-3.5 w-3.5" /><span className="sr-only">Filter by gender</span><select value={gender} onChange={(event) => setGender(event.target.value as "All" | Gender)} className="bg-transparent outline-none"><option value="All">All patients</option><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option></select></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-[#FAFCFC]"><tr className="text-[10px] font-bold uppercase tracking-[.1em] text-muted"><th scope="col" className="px-5 py-3">Patient</th><th scope="col" className="px-4 py-3">Age / Gender</th><th scope="col" className="px-4 py-3">Phone</th><th scope="col" className="px-4 py-3">Medical history</th><th scope="col" className="px-5 py-3">Added</th></tr></thead>
          <tbody className="text-xs">
            {filtered.map((patient, index) => <tr key={patient.id} className="border-t border-line">
              <td className="px-5 py-4"><div className="flex items-center gap-3"><span className={`avatar ${avatarStyles[index % avatarStyles.length]}`}>{initials(patient.name)}</span><span><span className="block font-bold">{patient.name}</span><span className="mt-0.5 block text-[10px] text-muted">ID · {patient.id.slice(-6).toUpperCase()}</span></span></div></td>
              <td className="px-4 py-4">{patient.age} <span className="text-muted">· {patient.gender}</span></td>
              <td className="px-4 py-4 whitespace-nowrap text-muted">{patient.phone}</td>
              <td className="px-4 py-4"><span className="inline-block max-w-[210px] truncate rounded-md bg-canvas px-2 py-1 text-[10px] text-muted" title={patient.medical_history || "No history recorded"}>{patient.medical_history || "No history recorded"}</span></td>
              <td className="px-5 py-4 whitespace-nowrap text-muted">{patient.created_at}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line px-5 py-3 text-[11px] text-muted">Showing <b className="text-ink">{filtered.length}</b> of <b className="text-ink">{patients.length}</b> patients</div>
      {filtered.length === 0 && <div className="border-t border-line px-5 py-10 text-center"><p className="text-xs font-semibold">{patients.length ? "No patients match your filters" : "No patients added yet"}</p><p className="mt-1 text-[11px] text-muted">{patients.length ? "Try another search or gender filter." : "Add a patient to create the first patient record."}</p></div>}
    </div>
  );
}
