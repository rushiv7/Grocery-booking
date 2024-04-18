import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

// Define interfaces for request body
interface RegisterRequestBody {
  email: string;
  password: string;
}

interface SignInRequestBody {
  username: string;
  password: string;
}

export default class UserController {
  constructor() {}

  async registerUser(
    req: Request<{}, {}, RegisterRequestBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.body?.email || !req.body?.password) {
        return res.status(403).json({ message: "Invalid data" });
      }

      const { email, password } = req.body;

      const user: UserModel | null = await UserModel.findOne({
        where: { email },
      });
      console.log(user);

      // Check if user already exists
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword: string = await bcrypt.hash(password, 10);

      // Create user
      const newUser: UserModel = UserModel.build({
        email,
        password: hashedPassword,
      });

      // Save user
      await newUser.save();

      // Return success response
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      next(error);
    }
  }

  async signIn(
    req: Request<{}, {}, SignInRequestBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.body?.username || !req.body?.password) {
        return res.status(403).json({ message: "Invalid data" });
      }

      const { username, password } = req.body;

      const user: UserModel | null = await UserModel.findOne({
        where: { email: username },
      });
      console.log(user);

      // Check if user exists
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const jwtSecret = process.env.JWT_SECRET || "LMAUWRFYS";

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "2d",
      });

      // Send JWT token as a cookie
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Error registering user:", error);
      next(error);
    }
  }
}
