import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signupHandler = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) return res.status(409).json({ error: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ username, email, passwordHash });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({
    user: { id: user._id, username: user.username, email: user.email },
    token,
  });
};

export const loginHandler = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) return res.status(401).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Incorrect password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({
    user: { id: user._id, username: user.username, email: user.email },
    token,
  });
};

export const meHandler = async (req: any, res: Response) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json({ user });
};

export const logoutHandler = async (_req: Request, res: Response) => {
  res.json({ message: "Logged out (client should delete token)" });
};
