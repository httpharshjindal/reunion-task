require("dotenv").config();
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import taskRouter from "./routes/task";
import statsRouter from "./routes/stats";
const app = express();
const PORT = process.env.PORT || 3005;
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/stats", statsRouter);
app.get("/", (req, res) => {
  res.json({ msg: "success" });
});
app.listen(PORT, () => {
  console.log(`Server listning on port:${PORT}`);
});
