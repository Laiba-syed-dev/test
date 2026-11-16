"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { bookAppointment } from "@/app/actions";

export interface AppointmentOption {
  id: string;
  name: string;
  detail: string;
}

export function AppointmentForm({ patients, doctors }: { patients: AppointmentOption[]; doctors: AppointmentOption[] }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const canBook = patients.length > 0 && doctors.length > 0;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = {
      patient_id: String(formData.get("patient_id") ?? ""),
      doctor_id: String(formData.get("doctor_id") ?? ""),
      appointment_date: String(formData.get("appointment_date") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };

    setFeedback(null);
    startTransition(async () => {
      const result = await bookAppointment(input);
      if (!result.ok) {
        setFeedback({ type: "error", text: result.error });
        return;
      }
      formRef.current?.reset();
      setFeedback({ type: "success", text: "Appointment booked successfully." });
      router.refresh();
    });
  }

  return (
    <>
      <button type="button" onClick={() => { setFeedback(null); setOpen(true); }} className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#11776f]"><Plus className="h-4 w-4" />Book appointment</button>
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10262d]/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !pending) setOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="book-appointment-title" className="max-h-[calc(100vh-2rem)] w-full max-w-[500px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
          <div className="mb-5 flex items-start justify-between"><div><h2 id="book-appointment-title" className="font-display text-lg font-bold">Book appointment</h2><p className="mt-1 text-xs text-muted">Choose a patient, doctor, and appointment time.</p></div><button type="button" aria-label="Close dialog" disabled={pending} onClick={() => setOpen(false)} className="rounded-lg p-2 text-muted hover:bg-canvas disabled:opacity-50"><X className="h-4 w-4" /></button></div>
          <form ref={formRef} onSubmit={submit} className="space-y-4">
            <label className="block text-xs font-semibold">Patient<span className="ml-1 text-rose">*</span><select name="patient_id" required defaultValue="" disabled={!patients.length || pending} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 disabled:bg-canvas"><option value="" disabled>Select a patient</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} · {patient.detail}</option>)}</select></label>
            <label className="block text-xs font-semibold">Doctor<span className="ml-1 text-rose">*</span><select name="doctor_id" required defaultValue="" disabled={!doctors.length || pending} className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 disabled:bg-canvas"><option value="" disabled>Select a doctor</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} · {doctor.detail}</option>)}</select></label>
            <label className="block text-xs font-semibold">Date and time<span className="ml-1 text-rose">*</span><input type="datetime-local" name="appointment_date" required disabled={pending} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal outline-none focus:border-teal focus:ring-2 focus:ring-teal/10" /></label>
            <label className="block text-xs font-semibold">Notes<textarea name="notes" rows={3} maxLength={2000} placeholder="Optional appointment notes" disabled={pending} className="mt-1.5 w-full resize-y rounded-lg border border-line px-3 py-2.5 text-sm font-normal outline-none placeholder:text-[#A2AFB3] focus:border-teal focus:ring-2 focus:ring-teal/10 disabled:bg-canvas" /></label>
            {!canBook && <p className="rounded-lg bg-[#FFF9F0] px-3 py-2 text-xs leading-5 text-[#8A5B1E]">Add at least one patient and one doctor before booking an appointment.</p>}
            {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`rounded-lg px-3 py-2 text-xs ${feedback.type === "error" ? "bg-[#FDEDEE] text-rose" : "bg-[#EAF7F0] text-[#328361]"}`}>{feedback.text}</p>}
            <div className="flex justify-end gap-2 border-t border-line pt-4"><button type="button" disabled={pending} onClick={() => setOpen(false)} className="rounded-lg border border-line px-4 py-2.5 text-xs font-semibold text-muted hover:bg-canvas disabled:opacity-50">Cancel</button><button type="submit" disabled={pending || !canBook} className="rounded-lg bg-teal px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#11776f] disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Booking…" : "Confirm booking"}</button></div>
          </form>
        </section>
      </div>}
    </>
  );
}
