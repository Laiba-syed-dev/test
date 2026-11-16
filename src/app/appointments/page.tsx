import { CalendarCheck2, CalendarClock, CalendarDays } from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { AppointmentsTable } from "@/components/appointments-table";
import { PageHeading } from "@/components/page-heading";
import { StatCard } from "@/components/stat-card";
import { getAppointments, getDoctors, getPatients } from "@/lib/data";

export default async function AppointmentsPage() {
  const [appointmentResult, patientResult, doctorResult] = await Promise.allSettled([
    getAppointments(),
    getPatients(),
    getDoctors(),
  ]);
  const loadErrors = [appointmentResult, patientResult, doctorResult].some((result) => result.status === "rejected");

  if (appointmentResult.status === "rejected") console.error("Unable to load appointments:", appointmentResult.reason);
  if (patientResult.status === "rejected") console.error("Unable to load appointment patient options:", patientResult.reason);
  if (doctorResult.status === "rejected") console.error("Unable to load appointment doctor options:", doctorResult.reason);

  const appointments = appointmentResult.status === "fulfilled" ? appointmentResult.value : [];
  const patients = patientResult.status === "fulfilled" ? patientResult.value : [];
  const doctors = doctorResult.status === "fulfilled" ? doctorResult.value : [];
  const patientOptions = patients.map((patient) => ({ id: patient._id.toHexString(), name: patient.name, detail: patient.phone }));
  const doctorOptions = doctors.map((doctor) => ({
    id: doctor._id.toHexString(),
    name: doctor.name,
    detail: `${doctor.specialization} · ${doctor.availability_status}`,
  }));

  const tableRows = appointments.map((appointment) => ({
    id: appointment._id.toHexString(),
    patientName: appointment.patient.name,
    patientPhone: appointment.patient.phone,
    doctorName: appointment.doctor.name,
    specialization: appointment.doctor.specialization,
    appointmentDate: appointment.appointment_date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    appointmentTime: appointment.appointment_date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    notes: appointment.notes,
    status: appointment.status,
  }));

  const scheduledCount = appointments.filter((appointment) => appointment.status === "Scheduled").length;
  const completedCount = appointments.filter((appointment) => appointment.status === "Completed").length;

  return (
    <section>
      <PageHeading eyebrow="Schedule" title="Appointments" description="A clear view of every visit, all in one place." action={<AppointmentForm patients={patientOptions} doctors={doctorOptions} />} />
      {loadErrors && <div role="alert" className="mb-5 rounded-xl border border-[#F2D7B1] bg-[#FFF9F0] px-4 py-3 text-xs text-[#8A5B1E]">Some appointment data could not be loaded. Check `MONGODB_URI` and confirm MongoDB is reachable; the table may be incomplete.</div>}

      {!patients.length && !doctors.length && !appointments.length && !loadErrors && <div className="panel mb-5 flex items-start gap-3 border-dashed p-4"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF4E6] text-amber"><CalendarClock className="h-4 w-4" /></span><div><h2 className="text-xs font-bold">Add records before scheduling</h2><p className="mt-1 text-[11px] leading-5 text-muted">Create at least one patient and one doctor, then you can book the first appointment.</p></div></div>}

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total appointments" value={loadErrors && appointmentResult.status === "rejected" ? "—" : String(appointments.length)} detail="All recorded visits" icon={CalendarDays} tone="teal" />
        <StatCard label="Scheduled" value={loadErrors && appointmentResult.status === "rejected" ? "—" : String(scheduledCount)} detail="Upcoming or in progress" icon={CalendarCheck2} tone="blue" />
        <StatCard label="Completed" value={loadErrors && appointmentResult.status === "rejected" ? "—" : String(completedCount)} detail="Visit marked complete" icon={CalendarClock} tone="amber" />
      </div>

      <AppointmentsTable appointments={tableRows} />
    </section>
  );
}
