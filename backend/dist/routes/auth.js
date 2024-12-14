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
const jsonwebtoken_1 = require("jsonwebtoken");
const types_1 = require("../types");
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const bcryptjs_1 = require("bcryptjs");
const app = (0, express_1.default)();
const authRouter = express_1.default.Router();
const SECRET_KEY = process.env.SECRET_KEY;
app.use(express_1.default.json());
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = types_1.signupBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            error: "invalid inputs",
        });
    }
    const existingUser = yield prismaClient_1.default.user.findFirst({
        where: {
            email: req.body.email,
        },
    });
    if (existingUser) {
        return res.status(409).json({
            error: "user Already Exists",
        });
    }
    try {
        const hashedPassword = yield (0, bcryptjs_1.hash)(req.body.password, 10);
        const user = yield prismaClient_1.default.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            },
        });
        if (user) {
            const userId = user.id;
            const token = (0, jsonwebtoken_1.sign)({ userId }, SECRET_KEY);
            return res.status(201).json({
                token: token,
                userId: userId,
            });
        }
    }
    catch (e) {
        return res.status(400).json({
            error: e,
        });
    }
}));
authRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = types_1.signinBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            error: "invalid inputs",
        });
    }
    try {
        const user = yield prismaClient_1.default.user.findFirst({
            where: {
                email: req.body.email,
            },
        });
        if (!user) {
            return res.status(404).json({
                error: "user not found",
            });
        }
        const validate = yield (0, bcryptjs_1.compare)(req.body.password, user.password);
        if (!validate) {
            return res.status(401).json({ error: "Incorrect Password" });
        }
        const userId = user.id;
        const token = yield (0, jsonwebtoken_1.sign)({ userId }, SECRET_KEY);
        return res.status(200).json({ token: token });
    }
    catch (e) {
        res
            .status(400)
            .json({ error: e, msg: "something went wrong while loggin in" });
    }
}));
exports.default = authRouter;
