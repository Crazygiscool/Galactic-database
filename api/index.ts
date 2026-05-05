import express, { type Express } from "express";
import cors from "cors";
import { setupDatabase } from "./database.js";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes after database is set up
import customRouter from "./routes/custom.js";

app.use("/api/custom", customRouter);

// Export for Vercel
export default app;

// DO NOT listen - Vercel handles this
