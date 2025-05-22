import jwt from "jsonwebtoken";
import { authHeader } from "../types";
import { Request, Response, NextFunction } from "express";

const SECRET_KEY = process.env.SECRET_KEY as string;

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: number;
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { success } = authHeader.safeParse(req.headers.authorization);

  if (!success) {
    res.status(400).json({
      error: "Invalid inputs,authHeader",
    });
    return;
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(400).json({ error: "Token is missing" });
    return;
  }
  try {
    if (token && SECRET_KEY) {
      const decode = jwt.verify(token, SECRET_KEY) as JwtPayloadWithUserId;
      if (decode && decode.userId) {
        req.userId = decode.userId;
        next();
        return;
      } else {
        res.status(403).json({ error: "Invalid token payload" });
        return;
      }
    } else {
      res.status(403).json({ error: "You don't have access to this" });
      return;
    }
  } catch (e) {
    res.status(403).json({ error: "something went wrong while login" });
    return;
  }
};

export default authMiddleware;
