"use server";

import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type {
  ActionResult,
  AddDoctorInput,
  AddPatientInput,
  AppointmentStatus,
  AvailabilityStatus,
  BookAppointmentInput,
  Gender,
} from "@/lib/types";

const genders: readonly Gender[] = ["Female", "Male", "Other"];
const availabilityStatuses: readonly AvailabilityStatus[] = ["Available", "Unavailable"];
const appointmentStatuses: readonly AppointmentStatus[] = ["Scheduled", "Completed", "Cancelled"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isObjectIdString(value: unknown): value is string {
  return typeof value === "string" && /^[\da-f]{24}$/i.test(value);
}

function failed<T>(error: string): ActionResult<T> {
  return { ok: false, error };
}

export async function addPatient(input: AddPatientInput): Promise<ActionResult<{ id: string }>> {
  if (!isRecord(input)) return failed("Patient details are required.");

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const age = input.age;
  const gender = input.gender;
  const medicalHistory = input.medical_history;

  if (!name || !phone) return failed("Name and phone are required.");
  if (typeof age !== "number" || !Number.isInteger(age) || age < 0 || age > 130) {
    return failed("Age must be a whole number between 0 and 130.");
  }
  if (typeof gender !== "string" || !genders.includes(gender as Gender)) {
    return failed("Choose a valid gender.");
  }
  if (medicalHistory !== undefined && typeof medicalHistory !== "string") {
    return failed("Medical history must be text.");
  }

  try {
    const db = await getDb();
    const result = await db.collection("patients").insertOne({
      name,
      age,
      gender,
      phone,
      medical_history: (medicalHistory ?? "").trim(),
      created_at: new Date(),
    });
    revalidatePath("/");
    revalidatePath("/patients");
    return { ok: true, data: { id: result.insertedId.toHexString() } };
  } catch (error) {
    console.error("MongoDB addPatient failed:", error);
    return failed("Unable to add patient. Please try again.");
  }
}

export async function addDoctor(input: AddDoctorInput): Promise<ActionResult<{ id: string }>> {
  if (!isRecord(input)) return failed("Doctor details are required.");

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const specialization = typeof input.specialization === "string" ? input.specialization.trim() : "";
  const availability = input.availability_status ?? "Available";

  if (!name || !specialization) return failed("Name and specialization are required.");
  if (typeof availability !== "string" || !availabilityStatuses.includes(availability as AvailabilityStatus)) {
    return failed("Choose a valid availability status.");
  }

  try {
    const db = await getDb();
    const result = await db.collection("doctors").insertOne({
      name,
      specialization,
      availability_status: availability,
      created_at: new Date(),
    });
    revalidatePath("/");
    revalidatePath("/doctors");
    return { ok: true, data: { id: result.insertedId.toHexString() } };
  } catch (error) {
    console.error("MongoDB addDoctor failed:", error);
    return failed("Unable to add doctor. Please try again.");
  }
}

export async function bookAppointment(
  input: BookAppointmentInput,
): Promise<ActionResult<{ id: string }>> {
  if (!isRecord(input)) return failed("Appointment details are required.");
  if (!isObjectIdString(input.patient_id) || !isObjectIdString(input.doctor_id)) {
    return failed("Choose a valid patient and doctor.");
  }
  if (typeof input.appointment_date !== "string") {
    return failed("Choose a valid appointment date and time.");
  }
  const appointmentDate = new Date(input.appointment_date);
  if (Number.isNaN(appointmentDate.getTime())) return failed("Choose a valid appointment date and time.");
  if (input.notes !== undefined && typeof input.notes !== "string") {
    return failed("Appointment notes must be text.");
  }

  const patientId = new ObjectId(input.patient_id);
  const doctorId = new ObjectId(input.doctor_id);

  try {
    const db = await getDb();
    const [patient, doctor] = await Promise.all([
      db.collection("patients").findOne({ _id: patientId }, { projection: { _id: 1 } }),
      db.collection("doctors").findOne({ _id: doctorId }, { projection: { _id: 1 } }),
    ]);
    if (!patient) return failed("The selected patient could not be found.");
    if (!doctor) return failed("The selected doctor could not be found.");

    const result = await db.collection("appointments").insertOne({
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      status: "Scheduled",
      notes: (input.notes ?? "").trim(),
      created_at: new Date(),
    });
    revalidatePath("/");
    revalidatePath("/appointments");
    return { ok: true, data: { id: result.insertedId.toHexString() } };
  } catch (error) {
    console.error("MongoDB bookAppointment failed:", error);
    return failed("Unable to book appointment. Please try again.");
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<ActionResult<{ id: string }>> {
  if (!isObjectIdString(id)) return failed("A valid appointment is required.");
  if (typeof status !== "string" || !appointmentStatuses.includes(status as AppointmentStatus)) {
    return failed("Choose a valid appointment status.");
  }

  try {
    const db = await getDb();
    const result = await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } },
    );
    if (result.matchedCount === 0) return failed("Appointment could not be found.");
    revalidatePath("/");
    revalidatePath("/appointments");
    return { ok: true, data: { id } };
  } catch (error) {
    console.error("MongoDB updateAppointmentStatus failed:", error);
    return failed("Unable to update appointment status. Please try again.");
  }
}
