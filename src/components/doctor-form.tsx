"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { addDoctor } from "@/app/actions";
import type { AvailabilityStatus } from "@/lib/types";

export function DoctorForm() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = {
      name: String(formData.get("name") ?? ""),
      specialization: String(formData.get("specialization") ?? ""),
      availability_status: String(formData.get("availability_status") ?? "Available") as AvailabilityStatus,
    };

    setFeedback(null);
    startTransition(async () => {
      const result = await addDoctor(input);
      if (!result.ok) {
        setFeedback({ type: "error", text: result.error });
        return;
      }
      formRef.current?.reset();
      setFeedback({ type: "success", text: "Doctor added successfully." });
      router.refresh();
    });
  }

  return (
    <>
      <button type="button" onClick={() => { setFeedback(null); setOpen(true); }} className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#11776f]"><Plus className="h-4 w-4" />Add doctor</button>
      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10262d]/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !pending) setOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="add-doctor-title" className="w-full max-w-[460px] rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
          <div className="mb-5 flex items-start justify-between"><div><h2 id="add-doctor-title" className="font-display text-lg font-bold">Add doctor</h2><p className="mt-1 text-xs text-muted">Add a member to your care team.</p></div><button type="button" aria-label="Close dialog" disabled={pending} onClick={() => setOpen(false)} className="rounded-lg p-2 text-muted hover:bg-canvas disabled:opacity-50"><X className="h-4 w-4" /></button></div>
          <form ref={formRef} onSubmit={submit} className="space-y-4">
            <label className="block text-xs font-semibold">Doctor name<span className="ml-1 text-rose">*</span><input name="name" required maxLength={120} autoComplete="name" placeholder="e.g. Dr. Maya Chen" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal outline-none transition placeholder:text-[#A2AFB3] focus:border-teal focus:ring-2 focus:ring-teal/10" /></label>
            <label className="block text-xs font-semibold">Specialization<span className="ml-1 text-rose">*</span><input name="specialization" required maxLength={100} placeholder="e.g. Cardiology" className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-sm font-normal outline-none transition placeholder:text-[#A2AFB3] focus:border-teal focus:ring-2 focus:ring-teal/10" /></label>
            <label className="block text-xs font-semibold">Availability status<select name="availability_status" defaultValue="Available" className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-teal focus:ring-2 focus:ring-teal/10"><option value="Available">Available</option><option value="Unavailable">Unavailable</option></select></label>
            {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`rounded-lg px-3 py-2 text-xs ${feedback.type === "error" ? "bg-[#FDEDEE] text-rose" : "bg-[#EAF7F0] text-[#328361]"}`}>{feedback.text}</p>}
            <div className="flex justify-end gap-2 border-t border-line pt-4"><button type="button" disabled={pending} onClick={() => setOpen(false)} className="rounded-lg border border-line px-4 py-2.5 text-xs font-semibold text-muted hover:bg-canvas disabled:opacity-50">Cancel</button><button type="submit" disabled={pending} className="rounded-lg bg-teal px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#11776f] disabled:cursor-wait disabled:opacity-60">{pending ? "Saving…" : "Add doctor"}</button></div>
          </form>
        </section>
      </div>}
    </>
  );
}
