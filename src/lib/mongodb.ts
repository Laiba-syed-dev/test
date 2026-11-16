import "server-only";

import { Db, MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env.local and add your MongoDB URI.");
  }
  return uri;
}

function getMongoClientPromise(): Promise<MongoClient> {
  if (globalForMongo.mongoClientPromise) return globalForMongo.mongoClientPromise;

  const client = new MongoClient(getMongoUri(), {
      appName: "carepoint-hms",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
  });
  const clientPromise = client.connect().catch((error: unknown) => {
    if (globalForMongo.mongoClientPromise === clientPromise) {
      globalForMongo.mongoClientPromise = undefined;
    }
    throw error;
  });
  globalForMongo.mongoClientPromise = clientPromise;
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  // The database name is the path segment in MONGODB_URI (for example, /hms).
  return client.db();
}
