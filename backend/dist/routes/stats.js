"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const app = (0, express_1.default)();
const statsRouter = express_1.default.Router();
app.use(express_1.default.json());
statsRouter.get("/", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user ID from the authenticated request
        const userId = req.userId;
        if (!userId) {
            res.status(400).json({ message: "User not authenticated" });
            return;
        }
        // Fetch tasks for the user
        const tasks = yield prismaClient_1.default.tasks.findMany({
            where: { userId },
        });
        if (!tasks.length) {
            res.status(200).json({
                message: "No tasks found.",
                stats: {
                    totalTasks: 0,
                    taskCompleted: 0,
                    taskPending: 0,
                    avgCompletionTime: 0,
                    pendingTasksByPriority: {},
                },
            });
            return;
        }
        // Calculate total tasks
        const totalTasks = tasks.length;
        // Calculate task completion percentages
        const taskCompleted = tasks.filter((task) => task.status === "DONE").length;
        const taskPending = totalTasks - taskCompleted;
        const completedPercentage = (taskCompleted / totalTasks) * 100;
        const pendingPercentage = (taskPending / totalTasks) * 100;
        // Calculate time lapsed and estimated time for pending tasks by priority
        let totalTimeSpent = 0; // Total time spent for completed tasks
        let totalPendingTimeLapsed = 0; // Total time lapsed for pending tasks
        let totalPendingTimeRemaining = 0; // Total time remaining for pending tasks
        const pendingTasksByPriority = {};
        tasks.forEach((task) => {
            if (task.status === "DONE") {
                // Total time taken for a completed task
                const timeTaken = (task.endDate.getTime() - task.startDate.getTime()) /
                    (1000 * 60 * 60); // in hours
                totalTimeSpent += timeTaken;
            }
            else if (task.status === "PENDING") {
                // Time lapsed for pending tasks
                const timeLapsed = Math.max(0, (new Date().getTime() - task.startDate.getTime()) / (1000 * 60 * 60)); // in hours
                // Estimate remaining time for pending tasks
                const timeRemaining = Math.max(0, (task.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60)); // in hours
                // Update the total pending time lapsed and estimated time remaining
                totalPendingTimeLapsed += timeLapsed;
                totalPendingTimeRemaining += timeRemaining;
                // Organize pending tasks by priority
                if (!pendingTasksByPriority[task.priority]) {
                    pendingTasksByPriority[task.priority] = {
                        pendingTasks: 0,
                        timeLapsed: 0,
                        timeRemaining: 0,
                    };
                }
                pendingTasksByPriority[task.priority].pendingTasks++;
                pendingTasksByPriority[task.priority].timeLapsed += timeLapsed;
                pendingTasksByPriority[task.priority].timeRemaining += timeRemaining;
            }
        });
        // Calculate average time for completed tasks
        const avgCompletionTime = totalTimeSpent / taskCompleted;
        // Create response object
        const stats = {
            totalTasks,
            taskCompleted,
            taskPending,
            completedPercentage,
            pendingPercentage,
            avgCompletionTime,
            totalTimeSpent,
            totalPendingTimeLapsed,
            totalPendingTimeRemaining,
            pendingTasksByPriority,
        };
        // Send the response
        res
            .status(200)
            .json({ message: "Task statistics fetched successfully", stats });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Something went wrong while fetching stats", error });
    }
}));
exports.default = statsRouter;
