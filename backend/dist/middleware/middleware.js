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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const types_1 = require("../types");
const SECRET_KEY = process.env.SECRET_KEY;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { success } = types_1.authHeader.safeParse(req.headers.authorization);
    if (!success) {
        return res.status(400).json({
            error: "invalid inputs",
        });
    }
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    try {
        if (token && SECRET_KEY) {
            const decode = yield (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            if (decode) {
                req.userId = decode.userId;
                next();
            }
        }
    }
    catch (e) {
        res.status(403).json({ error: "you dont have access to this" });
    }
});
exports.default = authMiddleware;
