"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { updateAppointmentStatus } from "@/app/actions";
import type { AppointmentStatus } from "@/lib/types";

const statusStyles: Record<AppointmentStatus, string> = {
  Scheduled: "bg-[#EAF7F0] text-[#419875]",
  Completed: "bg-[#EDF1FB] text-blue",
  Cancelled: "bg-[#FDEDEE] text-rose",
};

export function AppointmentStatusControl({ appointmentId, initialStatus }: { appointmentId: string; initialStatus: AppointmentStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => setStatus(initialStatus), [initialStatus]);

  function changeStatus(nextStatus: AppointmentStatus) {
    if (nextStatus === status || pending) return;
    setError("");
    startTransition(async () => {
      const result = await updateAppointmentStatus(appointmentId, nextStatus);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStatus(nextStatus);
      router.refresh();
    });
  }

  return (
    <div className="min-w-[125px]">
      <label className={`relative inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[status]} ${pending ? "opacity-60" : ""}`}>
        <span className="sr-only">Appointment status</span>
        <select value={status} disabled={pending} onChange={(event) => changeStatus(event.target.value as AppointmentStatus)} aria-label={`Status for appointment ${appointmentId.slice(-6)}`} className="appearance-none bg-transparent pr-4 outline-none">
          <option value="Scheduled">Scheduled</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-1 h-3 w-3" />
      </label>
      {pending && <span className="ml-1 text-[9px] text-muted">Saving</span>}
      {error && <p role="alert" className="mt-1 max-w-[160px] text-[10px] leading-4 text-rose">{error}</p>}
    </div>
  );
}
