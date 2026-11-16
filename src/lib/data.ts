import "server-only";

import type { Filter } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type {
  Appointment,
  AppointmentWithDetails,
  DashboardOverview,
  DashboardSummary,
  Doctor,
  Patient,
} from "@/lib/types";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const db = await getDb();
  const { start, end } = getTodayRange();

  const [totalPatients, activeDoctors, todaysAppointments] = await Promise.all([
    db.collection<Patient>("patients").countDocuments(),
    db.collection<Doctor>("doctors").countDocuments({ availability_status: "Available" }),
    db.collection<Appointment>("appointments").countDocuments({
      appointment_date: { $gte: start, $lt: end },
      status: { $ne: "Cancelled" },
    }),
  ]);

  return { totalPatients, activeDoctors, todaysAppointments };
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const db = await getDb();
  const { start, end } = getTodayRange();
  const patientCollection = db.collection<Patient>("patients");
  const doctorCollection = db.collection<Doctor>("doctors");
  const appointmentCollection = db.collection<Appointment>("appointments");
  const todayFilter: Filter<Appointment> = {
    appointment_date: { $gte: start, $lt: end },
    status: { $ne: "Cancelled" },
  };

  const [totalPatients, totalDoctors, totalAppointments, activeDoctors, todaysAppointmentsCount, availableDoctors, todayRecords] = await Promise.all([
    patientCollection.countDocuments(),
    doctorCollection.countDocuments(),
    appointmentCollection.countDocuments(),
    doctorCollection.countDocuments({ availability_status: "Available" }),
    appointmentCollection.countDocuments(todayFilter),
    doctorCollection.find({ availability_status: "Available" }).sort({ name: 1 }).limit(4).toArray(),
    appointmentCollection.find(todayFilter).sort({ appointment_date: 1 }).limit(5).toArray(),
  ]);

  return {
    summary: { totalPatients, activeDoctors, todaysAppointments: todaysAppointmentsCount },
    hasRecords: totalPatients + totalDoctors + totalAppointments > 0,
    availableDoctors,
    todaysAppointments: await attachAppointmentDetails(db, todayRecords),
  };
}

export async function getDoctors(): Promise<Doctor[]> {
  const db = await getDb();
  return db.collection<Doctor>("doctors").find().sort({ name: 1 }).toArray();
}

export async function getPatients(): Promise<Patient[]> {
  const db = await getDb();
  return db.collection<Patient>("patients").find().sort({ created_at: -1, name: 1 }).toArray();
}

export async function getAppointments(): Promise<AppointmentWithDetails[]> {
  const db = await getDb();
  const appointments = await db.collection<Appointment>("appointments")
    .find()
    .sort({ appointment_date: 1 })
    .toArray();

  return attachAppointmentDetails(db, appointments);
}

async function attachAppointmentDetails(
  db: Awaited<ReturnType<typeof getDb>>,
  appointments: Appointment[],
): Promise<AppointmentWithDetails[]> {
  if (appointments.length === 0) return [];

  const patientIds = [...new Map(appointments.map((appointment) => [
    appointment.patient_id.toHexString(), appointment.patient_id,
  ])).values()];
  const doctorIds = [...new Map(appointments.map((appointment) => [
    appointment.doctor_id.toHexString(), appointment.doctor_id,
  ])).values()];

  const [patients, doctors] = await Promise.all([
    db.collection<Patient>("patients").find({ _id: { $in: patientIds } }).toArray(),
    db.collection<Doctor>("doctors").find({ _id: { $in: doctorIds } }).toArray(),
  ]);

  const patientsById = new Map(patients.map((patient) => [patient._id.toHexString(), patient]));
  const doctorsById = new Map(doctors.map((doctor) => [doctor._id.toHexString(), doctor]));

  return appointments.map((appointment) => {
    const patient = patientsById.get(appointment.patient_id.toHexString());
    const doctor = doctorsById.get(appointment.doctor_id.toHexString());
    if (!patient || !doctor) {
      throw new Error(`Appointment ${appointment._id.toHexString()} references a missing patient or doctor.`);
    }

    return {
      ...appointment,
      patient: { _id: patient._id, name: patient.name, phone: patient.phone },
      doctor: { _id: doctor._id, name: doctor.name, specialization: doctor.specialization },
    };
  });
}
