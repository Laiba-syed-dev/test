import type { Document, ObjectId } from "mongodb";

export type AvailabilityStatus = "Available" | "Unavailable";
export type AppointmentStatus = "Scheduled" | "Completed" | "Cancelled";
export type Gender = "Female" | "Male" | "Other";

export interface Doctor extends Document {
  _id: ObjectId;
  name: string;
  specialization: string;
  availability_status: AvailabilityStatus;
  created_at: Date;
}

export interface Patient extends Document {
  _id: ObjectId;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  medical_history: string;
  created_at: Date;
}

export interface Appointment extends Document {
  _id: ObjectId;
  patient_id: ObjectId;
  doctor_id: ObjectId;
  appointment_date: Date;
  status: AppointmentStatus;
  notes: string;
  created_at: Date;
}

export interface AppointmentWithDetails extends Appointment {
  patient: Pick<Patient, "_id" | "name" | "phone">;
  doctor: Pick<Doctor, "_id" | "name" | "specialization">;
}

export interface DashboardSummary {
  totalPatients: number;
  activeDoctors: number;
  todaysAppointments: number;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  hasRecords: boolean;
  availableDoctors: Doctor[];
  todaysAppointments: AppointmentWithDetails[];
}

export interface AddPatientInput {
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  medical_history?: string;
}

export interface AddDoctorInput {
  name: string;
  specialization: string;
  availability_status?: AvailabilityStatus;
}

export interface BookAppointmentInput {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  notes?: string;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
