import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import jobRoutes from "./src/routes/jobroutes.js";
import appRoutes from "./src/routes/approutes.js"
import profileRoutes from "./src/routes/profileroutes.js";
import authRoutes from "./src/routes/authroutes.js";
import adminRoutes from "./src/routes/adminroutes.js"


dotenv.config();
const app = express();

app.use(cors({
  origin : [
    'http://localhost:4173',
    'http://10.208.171.161:4173',
    'http://localhost:8080',
    'https://jobportal-mocha-gamma.vercel.app/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
