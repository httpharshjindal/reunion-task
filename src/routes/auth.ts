import express, { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { signupBody, signinBody } from "../types";
import prisma from "../lib/prismaClient";
import { hash, compare } from "bcryptjs";

const app = express();
const authRouter = express.Router();
const SECRET_KEY = process.env.SECRET_KEY as string;
app.use(express.json());

authRouter.post("/signup", async (req: any, res: any) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid inputs",
    });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    if (user) {
      const token = sign({ userId: user.id }, SECRET_KEY);
      return res.status(201).json({
        token: token,
        userId: user.id,
        email: user.email,
      });
    }
  } catch (e) {
    console.error("Error during signup:", e);
    return res.status(400).json({
      error: "Something went wrong during signup",
      message: e instanceof Error ? e.message : "Unknown error"
    });
  }
});

authRouter.post("/signin", async (req: any, res: any) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "Invalid inputs",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const validate = await compare(req.body.password, user.password);
    if (!validate) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = sign({ userId: user.id }, SECRET_KEY);
    return res.status(200).json({
      token: token,
      userId: user.id,
      email: user.email
    });
  } catch (e) {
    console.error("Error during signin:", e);
    res.status(400).json({
      error: "Something went wrong while signing in",
      message: e instanceof Error ? e.message : "Unknown error"
    });
  }
});

export default authRouter;
