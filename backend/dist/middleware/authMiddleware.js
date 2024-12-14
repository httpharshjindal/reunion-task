"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../types");
const SECRET_KEY = process.env.SECRET_KEY;
const authMiddleware = (req, res, next) => {
    var _a;
    const { success } = types_1.authHeader.safeParse(req.headers.authorization);
    if (!success) {
        res.status(400).json({
            error: "Invalid inputs,authHeader",
        });
        return;
    }
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(400).json({ error: "Token is missing" });
        return;
    }
    try {
        if (token && SECRET_KEY) {
            const decode = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            if (decode && decode.userId) {
                req.userId = decode.userId;
                next();
                return;
            }
            else {
                res.status(403).json({ error: "Invalid token payload" });
                return;
            }
        }
        else {
            res.status(403).json({ error: "You don't have access to this" });
            return;
        }
    }
    catch (e) {
        res.status(403).json({ error: "something went wrong while login" });
        return;
    }
};
exports.default = authMiddleware;
