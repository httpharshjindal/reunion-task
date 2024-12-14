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
const types_1 = require("../types");
const app = (0, express_1.default)();
const taskRouter = express_1.default.Router();
app.use(express_1.default.json());
taskRouter.get("/bulk", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var tasks;
    try {
        const { priority, status, order } = req.query;
        const filter = {};
        var sort = {};
        if (req.userId) {
            filter.userId = req.userId;
        }
        if (priority) {
            filter.priority = parseInt(priority);
        }
        if (status) {
            filter.status = status;
        }
        if (order) {
            sort = {
                [order.split("-")[0]]: order.split("-")[1],
            };
        }
        tasks = yield prismaClient_1.default.tasks.findMany({
            where: filter,
            orderBy: sort,
        });
        res
            .status(200)
            .json({ message: "Tasks fetched successfully", tasks: tasks });
    }
    catch (e) {
        res.status(400).json({
            message: "Something went wrong while fetching",
            e: e,
            tasks: tasks || [],
        });
    }
}));
taskRouter.get("/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const task = yield prismaClient_1.default.tasks.findUnique({
        where: {
            id: id,
        },
    });
    if (!task) {
        res.status(404).json({ message: "Tasks not found" });
        return;
    }
    res.status(200).json({ message: "Tasks fetched successfully", task: task });
}));
taskRouter.post("/", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = types_1.createTaskBody.safeParse(req.body);
    console.log(req.body);
    if (!success) {
        res.status(400).json({ error: "Invalid inputs" });
        return;
    }
    try {
        if (req.userId) {
            const task = yield prismaClient_1.default.tasks.create({
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
    }
    catch (e) {
        res.status(400).json({ error: "Something went wrong", e: e });
    }
}));
taskRouter.put("/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        if (req.userId) {
            const task = yield prismaClient_1.default.tasks.update({
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
    }
    catch (e) {
        res.status(400).json({ error: "Something went wrong", e: e });
    }
}));
taskRouter.delete("/", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    console.log(ids);
    if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: "No task IDs provided or invalid input" });
        return;
    }
    try {
        if (req.userId) {
            const tasks = yield prismaClient_1.default.tasks.deleteMany({
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
    }
    catch (e) {
        res.status(400).json({ error: "Something went wrong", e: e });
    }
}));
exports.default = taskRouter;
