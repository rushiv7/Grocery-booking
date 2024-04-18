import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/User.model";
import bcrypt from "bcrypt";

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

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body, "dsa");

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
}
