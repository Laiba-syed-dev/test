import { CalendarClock, UserRoundPlus, UsersRound } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { PatientForm } from "@/components/patient-form";
import { PatientsTable } from "@/components/patients-table";
import { StatCard } from "@/components/stat-card";
import { getDashboardSummary, getPatients } from "@/lib/data";

export default async function PatientsPage() {
  const [patientResult, summaryResult] = await Promise.allSettled([
    getPatients(),
    getDashboardSummary(),
  ]);
  const databaseUnavailable = patientResult.status === "rejected" || summaryResult.status === "rejected";

  if (patientResult.status === "rejected") console.error("Unable to load patients:", patientResult.reason);
  if (summaryResult.status === "rejected") console.error("Unable to load patient page summary:", summaryResult.reason);

  const patients = patientResult.status === "fulfilled" ? patientResult.value : [];
  const todayAppointments = summaryResult.status === "fulfilled" ? summaryResult.value.todaysAppointments : 0;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const addedThisMonth = patients.filter((patient) => patient.created_at >= monthStart).length;

  const rows = patients.map((patient) => ({
    id: patient._id.toHexString(),
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone,
    medical_history: patient.medical_history,
    created_at: patient.created_at.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  return (
    <section>
      <PageHeading eyebrow="Patient care" title="Patients" description="View patient records and medical history." action={<PatientForm />} />
      {databaseUnavailable && <div role="alert" className="mb-5 rounded-xl border border-[#F2D7B1] bg-[#FFF9F0] px-4 py-3 text-xs text-[#8A5B1E]">Some patient information could not be loaded. Check `MONGODB_URI` and confirm MongoDB is reachable.</div>}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total patients" value={databaseUnavailable && patientResult.status === "rejected" ? "—" : new Intl.NumberFormat("en-US").format(patients.length)} detail="Patient records" icon={UsersRound} tone="teal" />
        <StatCard label="Added this month" value={databaseUnavailable && patientResult.status === "rejected" ? "—" : String(addedThisMonth)} detail="New patient records" icon={UserRoundPlus} tone="blue" />
        <StatCard label="Appointments today" value={summaryResult.status === "rejected" ? "—" : String(todayAppointments)} detail="Excludes cancelled visits" icon={CalendarClock} tone="amber" />
      </div>
      <PatientsTable patients={rows} />
    </section>
  );
}
