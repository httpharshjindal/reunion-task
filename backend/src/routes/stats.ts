import express from "express";
import authMiddleware from "../middleware/authMiddleware";
const app = express();
const statsRouter = express.Router();
app.use(express.json());

statsRouter.get("/", authMiddleware, async (req, res) => {
    // {
    //     totalTasks,
    //     taskCompleted,
    //     taskPending
    //     averageTime per Task
    //     pending task
    //     total time lapsed 
    //     total time to finish

    //     arr [
    //         {
    //             priority:1:,
    //             tasks:{
    //                 pending task ,
    //                 time lapsed
    //                 time to finish
    //             }
    //         }
    //     ]
    // }
});
export default statsRouter;
