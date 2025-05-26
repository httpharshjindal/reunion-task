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
      userId: req.userId // Always filter by userId
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
      tasks: []
    });
  }
});

taskRouter.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const task = await prisma.tasks.findUnique({
    where: {
      id: id,
    },
  });
  if (!task) {
    res.status(404).json({ message: "Tasks not found" });
    return;
  }
  res.status(200).json({ message: "Tasks fetched successfully", task: task });
});

taskRouter.post("/", async (req: Request, res: Response) => {
  const { success } = createTaskBody.safeParse(req.body);
  console.log(req.body);
  if (!success) {
    res.status(400).json({ error: "Invalid inputs" });
    return;
  }
  try {
    if (req.userId) {
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
      res
        .status(200)
        .json({ message: "Tasks created successfully", task: task.id });
    }
  } catch (e) {
    res.status(400).json({ error: "Something went wrong", e: e });
  }
});

taskRouter.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    if (req.userId) {
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
          updatedDate: req.body.updatedDate,
        },
      });
      res
        .status(200)
        .json({ message: "Tasks Updated successfully", task: task.id });
    }
  } catch (e) {
    res.status(400).json({ error: "Something went wrong", e: e });
  }
});
taskRouter.delete("/", async (req, res) => {
  const { ids } = req.body;
  console.log(ids)
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: "No task IDs provided or invalid input" });
    return;
  }

  try {
    if (req.userId) {
      const tasks = await prisma.tasks.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      res.status(200).json({
        message: `${tasks.count} tasks deleted successfully`,
        deletedTasksCount: tasks.count,
      });
    }
  } catch (e) {
    res.status(400).json({ error: "Something went wrong", e: e });
  }
});

export default taskRouter;
