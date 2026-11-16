// DEVELOPMENT SEED ONLY — this script deletes all documents from the doctors,
// patients, and appointments collections before inserting the sample records.
// Run only against a disposable development database; never run against data
// you need to keep.
// Example: mongosh "<MONGODB_URI including /hms>" mongodb/seed.js

// Remove appointments first so no temporary dangling references remain while
// doctors and patients are being replaced. These are the only collections cleared.
db.appointments.deleteMany({});
db.doctors.deleteMany({});
db.patients.deleteMany({});

const doctors = [
  {
    _id: ObjectId("100000000000000000000001"),
    name: "Dr. Maya Chen",
    specialization: "Cardiology",
    availability_status: "Available",
    created_at: new Date(),
  },
  {
    _id: ObjectId("100000000000000000000002"),
    name: "Dr. Omar Hassan",
    specialization: "Pediatrics",
    availability_status: "Available",
    created_at: new Date(),
  },
  {
    _id: ObjectId("100000000000000000000003"),
    name: "Dr. Sofia Patel",
    specialization: "Neurology",
    availability_status: "Unavailable",
    created_at: new Date(),
  },
  {
    _id: ObjectId("100000000000000000000004"),
    name: "Dr. James Okafor",
    specialization: "Orthopedics",
    availability_status: "Available",
    created_at: new Date(),
  },
  {
    _id: ObjectId("100000000000000000000005"),
    name: "Dr. Elena García",
    specialization: "Family Medicine",
    availability_status: "Available",
    created_at: new Date(),
  },
];

const patients = [
  {
    _id: ObjectId("200000000000000000000001"),
    name: "Ava Thompson",
    age: NumberInt(34),
    gender: "Female",
    phone: "+1-415-555-0101",
    medical_history: "Mild asthma",
    created_at: new Date(),
  },
  {
    _id: ObjectId("200000000000000000000002"),
    name: "Noah Williams",
    age: NumberInt(8),
    gender: "Male",
    phone: "+1-415-555-0102",
    medical_history: "Seasonal allergies",
    created_at: new Date(),
  },
  {
    _id: ObjectId("200000000000000000000003"),
    name: "Liam Johnson",
    age: NumberInt(62),
    gender: "Male",
    phone: "+1-415-555-0103",
    medical_history: "Hypertension",
    created_at: new Date(),
  },
  {
    _id: ObjectId("200000000000000000000004"),
    name: "Mia Rodriguez",
    age: NumberInt(27),
    gender: "Female",
    phone: "+1-415-555-0104",
    medical_history: "No known conditions",
    created_at: new Date(),
  },
  {
    _id: ObjectId("200000000000000000000005"),
    name: "Ethan Brooks",
    age: NumberInt(45),
    gender: "Other",
    phone: "+1-415-555-0105",
    medical_history: "Type 2 diabetes",
    created_at: new Date(),
  },
];

db.doctors.insertMany(doctors);
db.patients.insertMany(patients);

const now = new Date();
db.appointments.insertMany([
  {
    patient_id: patients[0]._id,
    doctor_id: doctors[0]._id,
    appointment_date: new Date(now.getTime() + 60 * 60 * 1000),
    status: "Scheduled",
    notes: "Follow-up consultation",
    created_at: now,
  },
  {
    patient_id: patients[1]._id,
    doctor_id: doctors[1]._id,
    appointment_date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    status: "Scheduled",
    notes: "Routine pediatric checkup",
    created_at: now,
  },
  {
    patient_id: patients[2]._id,
    doctor_id: doctors[2]._id,
    appointment_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    status: "Completed",
    notes: "Blood pressure review",
    created_at: now,
  },
  {
    patient_id: patients[3]._id,
    doctor_id: doctors[3]._id,
    appointment_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    status: "Scheduled",
    notes: "Knee pain assessment",
    created_at: now,
  },
  {
    patient_id: patients[4]._id,
    doctor_id: doctors[4]._id,
    appointment_date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
    status: "Cancelled",
    notes: "Rescheduled by patient",
    created_at: now,
  },
]);

print("Inserted 5 doctors, 5 patients, and 5 appointments into the development database.");
