import type { AppointmentStatus, AvailabilityStatus } from "@/lib/types";

const styles: Record<AppointmentStatus | AvailabilityStatus, string> = {
  Scheduled: "bg-[#EAF7F0] text-[#419875]",
  Completed: "bg-[#EDF1FB] text-blue",
  Cancelled: "bg-[#FDEDEE] text-rose",
  Available: "bg-[#EAF7F0] text-[#419875]",
  Unavailable: "bg-[#FFF4E6] text-amber",
};

export function StatusBadge({ status }: { status: AppointmentStatus | AvailabilityStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}>{status}</span>;
}
