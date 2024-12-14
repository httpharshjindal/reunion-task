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
const app = (0, express_1.default)();
const statsRouter = express_1.default.Router();
app.use(express_1.default.json());
statsRouter.get("/", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
exports.default = statsRouter;
