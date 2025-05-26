import jwt from "jsonwebtoken";
import { authHeader } from "../types";
import { Request, Response, NextFunction } from "express";

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const SECRET_KEY = process.env.SECRET_KEY as string;

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: number;
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Validate authorization header format
    const { success } = authHeader.safeParse(req.headers.authorization);
    if (!success) {
      res.status(401).json({
        error: "Invalid authorization header format. Expected: 'Bearer <token>'",
      });
      return;
    }

    // Extract token
    const authHeaderValue = req.headers.authorization;
    if (!authHeaderValue) {
      res.status(401).json({ error: "Authorization header is missing" });
      return;
    }

    const token = authHeaderValue.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Authentication token is missing" });
      return;
    }

    // Verify token and SECRET_KEY
    if (!SECRET_KEY) {
      res.status(500).json({ error: "Server configuration error: SECRET_KEY is not set" });
      return;
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayloadWithUserId;
      
      if (!decoded.userId) {
        res.status(401).json({ error: "Invalid token: missing user ID" });
        return;
      }

      // Set userId in request object
      req.userId = decoded.userId;
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: "Token has expired" });
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: "Invalid token" });
      } else {
        res.status(401).json({ error: "Token verification failed" });
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error during authentication" });
  }
};

export default authMiddleware;
