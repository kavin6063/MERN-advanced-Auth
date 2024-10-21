import express from "express";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

app.use(cookieParser());
const port = process.env.PORT || 3000;
const __dirname = path.resolve();
connectDB();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
app.listen(port, () => {
  console.log(`server running: http://localhost:${port}/`);
});
