"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const task_1 = __importDefault(require("./routes/task"));
const stats_1 = __importDefault(require("./routes/stats"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3005;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/task", task_1.default);
app.use("/api/v1/stats", stats_1.default);
app.get("/", (req, res) => {
    res.json({ msg: "success" });
});
app.listen(PORT, () => {
    console.log(`Server listning on port:${PORT}`);
});
