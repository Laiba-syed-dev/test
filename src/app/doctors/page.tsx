import { BriefcaseMedical, CircleCheck, Stethoscope } from "lucide-react";
import { DoctorForm } from "@/components/doctor-form";
import { DoctorsTable } from "@/components/doctors-table";
import { PageHeading } from "@/components/page-heading";
import { StatCard } from "@/components/stat-card";
import { getDoctors } from "@/lib/data";

export default async function DoctorsPage() {
  let doctors = await getDoctors().catch((error: unknown) => {
    console.error("Unable to load doctors:", error);
    return null;
  });
  const databaseUnavailable = doctors === null;
  doctors ??= [];

  const availableCount = doctors.filter((doctor) => doctor.availability_status === "Available").length;
  const specialtyCount = new Set(doctors.map((doctor) => doctor.specialization.trim().toLowerCase())).size;
  const rows = doctors.map((doctor) => ({
    id: doctor._id.toHexString(),
    name: doctor.name,
    specialization: doctor.specialization,
    availability_status: doctor.availability_status,
    created_at: doctor.created_at.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  return (
    <section>
      <PageHeading eyebrow="Care team" title="Doctors" description="Manage your medical team and availability." action={<DoctorForm />} />
      {databaseUnavailable && <div role="alert" className="mb-5 rounded-xl border border-[#F2D7B1] bg-[#FFF9F0] px-4 py-3 text-xs text-[#8A5B1E]">Couldn’t load doctors. Check `MONGODB_URI` and confirm MongoDB is reachable.</div>}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total doctors" value={databaseUnavailable ? "—" : String(doctors.length)} detail="In your care team" icon={Stethoscope} tone="teal" />
        <StatCard label="Available now" value={databaseUnavailable ? "—" : String(availableCount)} detail="Marked available" icon={CircleCheck} tone="blue" />
        <StatCard label="Specialties" value={databaseUnavailable ? "—" : String(specialtyCount)} detail="Across your team" icon={BriefcaseMedical} tone="amber" />
      </div>
      <DoctorsTable doctors={rows} />
    </section>
  );
}
