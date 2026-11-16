# Carepoint HMS

Carepoint is a Next.js App Router application for the Hospital Management System MVP. It uses TypeScript, Tailwind CSS, Lucide React, and the official MongoDB Node.js driver.

## Local setup

1. Install Node.js 20 or newer and npm.
2. From the project directory, install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and set the MongoDB connection string and database name:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/hms?retryWrites=true&w=majority
   ```

   The database name (`hms`) is part of the URI path. For local MongoDB, use `mongodb://127.0.0.1:27017/hms`. Never commit `.env.local` or expose `MONGODB_URI` through a `NEXT_PUBLIC_` variable.

4. In Atlas, create a database user and allow your development IP in Network Access. For local MongoDB, make sure the MongoDB server is running.
5. Initialize the collections, validators, and indexes. Use the same full connection string configured in `.env.local` (including the `/hms` database path):

   ```bash
   mongosh "<MONGODB_URI>" mongodb/setup.js
   ```

6. Optional: populate the three collections with sample data. This deletes existing documents in those three collections first, so use only a disposable development database:

   ```bash
   mongosh "<MONGODB_URI>" mongodb/seed.js
   ```

7. Start the website:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

The app has four routes: `/`, `/doctors`, `/patients`, and `/appointments`. MongoDB access is server-only through the reusable connection in `src/lib/mongodb.ts`. Do not put credentials in client components or browser code.

## Available commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## MVP scope

The current UI is a scaffold with the Carepoint shell and placeholder data views. The connection helper and database initialization scripts are in place for the next implementation phase. Authentication and authorization are not implemented; do not use this version for real patient information or expose it publicly without appropriate security controls.
