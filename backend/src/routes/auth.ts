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
      error: "invalid inputs",
    });
  }
  const existingUser = await prisma.user.findFirst({
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
    const hashedPassword = await hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
    });
    if (user) {
      const userId = user.id;
      const token = sign({ email: user.email }, SECRET_KEY);
      return res.status(201).json({
        token: token,
        email: user.email,
      });
    }
  } catch (e) {
    return res.status(400).json({
      error: e,
    });
  }
});

authRouter.post("/signin", async (req: any, res: any) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      error: "invalid inputs",
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
        error: "user not found",
      });
    }
    const validate = await compare(req.body.password, user.password);
    if (!validate) {
      return res.status(401).json({ error: "Incorrect Password" });
    }
    const token = await sign({ email: user.email }, SECRET_KEY);
    return res.status(200).json({ token: token });
  } catch (e) {
    res
      .status(400)
      .json({ error: e, msg: "something went wrong while loggin in" });
  }
});

export default authRouter;
