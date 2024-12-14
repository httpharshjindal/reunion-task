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
const app = (0, express_1.default)();
app.use(express_1.default.json());
const types_1 = require("../types");
const userRouter = express_1.default.Router();
userRouter.post("/user/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = types_1.signupBody.safeParse(req.body);
    if (!success) {
        res.json({
            "error": "invalid inputs"
        });
    }
    const existingUser = yield prismafindUnique({
        where: {
            email: req.body.email
        }
    });
    if (existingUser) {
        res.status(409).json({
            "error": "user Already Exists"
        });
    }
    try {
        const user = yield ({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
    }
    catch (e) {
        console.log(e);
    }
    res.status(409).json({
        "error": "user Already Exists"
    });
}));
exports.default = userRouter;
