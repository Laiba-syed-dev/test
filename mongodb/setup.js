// Run with mongosh against the intended database, for example:
// mongosh "<MONGODB_URI including /hms>" mongodb/setup.js
// This script creates or updates validators and indexes. It does not delete data.

function ensureCollection(name, validator) {
  const exists = db.getCollectionInfos({ name }).length > 0;

  if (exists) {
    db.runCommand({
      collMod: name,
      validator,
      validationLevel: "strict",
      validationAction: "error",
    });
  } else {
    db.createCollection(name, {
      validator,
      validationLevel: "strict",
      validationAction: "error",
    });
  }
}

ensureCollection("doctors", {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "specialization", "availability_status", "created_at"],
    properties: {
      name: { bsonType: "string", minLength: 1 },
      specialization: { bsonType: "string", minLength: 1 },
      availability_status: { enum: ["Available", "Unavailable"] },
      created_at: { bsonType: "date" },
    },
  },
});

ensureCollection("patients", {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "age", "gender", "phone", "medical_history", "created_at"],
    properties: {
      name: { bsonType: "string", minLength: 1 },
      age: { bsonType: "int", minimum: 0, maximum: 130 },
      gender: { enum: ["Female", "Male", "Other"] },
      phone: { bsonType: "string", minLength: 1 },
      medical_history: { bsonType: "string" },
      created_at: { bsonType: "date" },
    },
  },
});

ensureCollection("appointments", {
  $jsonSchema: {
    bsonType: "object",
    required: ["patient_id", "doctor_id", "appointment_date", "status", "notes", "created_at"],
    properties: {
      patient_id: { bsonType: "objectId" },
      doctor_id: { bsonType: "objectId" },
      appointment_date: { bsonType: "date" },
      status: { enum: ["Scheduled", "Completed", "Cancelled"] },
      notes: { bsonType: "string" },
      created_at: { bsonType: "date" },
    },
  },
});

db.appointments.createIndex({ appointment_date: 1 });
db.appointments.createIndex({ patient_id: 1 });
db.appointments.createIndex({ doctor_id: 1 });
db.patients.createIndex({ name: 1 });
db.doctors.createIndex({ name: 1 });

print(`MongoDB HMS collections, validators, and indexes are ready in '${db.getName()}'.`);
