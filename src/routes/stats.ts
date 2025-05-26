import express, { Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import prisma from "../lib/prismaClient";

const app = express();
const statsRouter = express.Router();

app.use(express.json());

interface PriorityTaskStats {
  pendingTasks: number;
  timeLapsed: number;
  timeRemaining: number;
}

statsRouter.get("/", async (req: Request, res: Response) => {
  try {
    // Get the user ID from the authenticated request
    const email = req.email;
    if (!email) {
      res.status(400).json({ message: "User not authenticated" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    // Fetch tasks for the user
    const tasks = await prisma.tasks.findMany({
      where: { userId: user.id },
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

    const pendingTasksByPriority: { [key: number]: PriorityTaskStats } = {};

    tasks.forEach((task) => {
      if (task.status === "DONE") {
        // Total time taken for a completed task
        const timeTaken =
          (task.endDate.getTime() - task.startDate.getTime()) /
          (1000 * 60 * 60); // in hours
        totalTimeSpent += timeTaken;
      } else if (task.status === "PENDING") {
        // Time lapsed for pending tasks
        const timeLapsed = Math.max(
          0,
          (new Date().getTime() - task.startDate.getTime()) / (1000 * 60 * 60)
        ); // in hours

        // Estimate remaining time for pending tasks
        const timeRemaining = Math.max(
          0,
          (task.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60)
        ); // in hours

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
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching stats", error });
  }
});

export default statsRouter;
