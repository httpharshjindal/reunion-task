import express, { Request, Response } from "express";
import authMiddleware from "../middleware/authMiddleware";
import prisma from "../lib/prismaClient";
import { createTaskBody } from "../types";

const app = express();
const taskRouter = express.Router();

app.use(express.json());

taskRouter.get("/bulk", async (req: Request, res: Response) => {
  try {
    const { priority, status, order } = req.query;
    const filter: any = {
      userId: req.userId
    };
    var sort: any = {};

    if (priority) {
      filter.priority = parseInt(priority as string);
    }
    if (status) {
      filter.status = status;
    }

    if (order) {
      sort = {
        [(order as string).split("-")[0]]: (order as string).split("-")[1],
      };
    }

    const tasks = await prisma.tasks.findMany({
      where: filter,
      orderBy: sort,
    });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks: tasks
    });
  } catch (e) {
    console.error("Error fetching tasks:", e);
    res.status(400).json({
      message: "Something went wrong while fetching tasks",
      error: e instanceof Error ? e.message : "Unknown error",
      tasks: [],
    });
  }
});

taskRouter.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const task = await prisma.tasks.findFirst({
      where: {
        id: id,
        userId: req.userId
      },
    });
    
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    
    res.status(200).json({ message: "Task fetched successfully", task: task });
  } catch (e) {
    console.error("Error fetching task:", e);
    res.status(400).json({
      message: "Something went wrong while fetching task",
      error: e instanceof Error ? e.message : "Unknown error"
    });
  }
});

taskRouter.post("/", async (req: Request, res: Response) => {
  const { success } = createTaskBody.safeParse(req.body);
  if (!success) {
    res.status(400).json({ error: "Invalid inputs" });
    return;
  }
  
  if (!req.userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }
  
  try {
    const task = await prisma.tasks.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        updatedDate: req.body.startDate,
        priority: req.body.priority,
        userId: req.userId,
      },
    });
    res.status(201).json({ 
      message: "Task created successfully", 
      taskId: task.id 
    });
  } catch (e) {
    console.error("Error creating task:", e);
    res.status(400).json({ 
      error: "Something went wrong while creating task",
      message: e instanceof Error ? e.message : "Unknown error"
    });
  }
});

taskRouter.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const existingTask = await prisma.tasks.findFirst({
      where: {
        id: id,
        userId: req.userId
      }
    });

    if (!existingTask) {
      res.status(404).json({ message: "Task not found or unauthorized" });
      return;
    }

    const task = await prisma.tasks.update({
      where: {
        id: id,
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        priority: req.body.priority,
        updatedDate: new Date(),
      },
    });
    res.status(200).json({ 
      message: "Task updated successfully", 
      taskId: task.id 
    });
  } catch (e) {
    console.error("Error updating task:", e);
    res.status(400).json({ 
      error: "Something went wrong while updating task",
      message: e instanceof Error ? e.message : "Unknown error"
    });
  }
});

taskRouter.delete("/", async (req: Request, res: Response) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: "No task IDs provided or invalid input" });
    return;
  }

  try {
    const tasks = await prisma.tasks.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId: req.userId
      },
    });

    res.status(200).json({
      message: `${tasks.count} tasks deleted successfully`,
      deletedTasksCount: tasks.count,
    });
  } catch (e) {
    console.error("Error deleting tasks:", e);
    res.status(400).json({ 
      error: "Something went wrong while deleting tasks",
      message: e instanceof Error ? e.message : "Unknown error"
    });
  }
});

export default taskRouter;
