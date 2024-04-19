import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRoles } from "../utils/enums";
import {
  IUserAuthInfoRequest,
  jwtSecret,
  responseSignature,
} from "../utils/constants";
import { UserModel } from "../models";
require("dotenv").config();

export default class AuthController {
  constructor() {}

  /*
  Fn to register user into app
  */
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body?.email || !req.body?.password) {
        return responseSignature(res, 403, false, "Invalid Body");
      }

      const { email, password } = req.body;

      const user: UserModel | null = await UserModel.findOne({
        where: { email },
      });

      // Check if user already exists
      if (user) {
        return responseSignature(res, 400, false, "User already exists");
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
      return responseSignature(res, 201, true, "User registered successfully");
    } catch (error) {
      console.error("Error registering user:", error);
      next(error);
    }
  }

  /*
  Fn to signin user into app
  */
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body?.username || !req.body?.password) {
        return responseSignature(res, 403, false, "Invalid Body");
      }

      const { username, password } = req.body;

      const user: UserModel | null = await UserModel.findOne({
        where: { email: username },
      });

      // Check if user exists
      if (!user) {
        return responseSignature(
          res,
          401,
          false,
          "Invalid username or password"
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return responseSignature(
          res,
          401,
          false,
          "Invalid username or password"
        );
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
        expiresIn: "1h",
      });

      // Send JWT token as a cookie
      res.cookie("token", token, { httpOnly: true });
      return responseSignature(res, 200, true, "Login successful");
    } catch (error) {
      console.error("Error registering user:", error);
      next(error);
    }
  }

  /*
  Fn to modify user role to admin
  */
  async promoteToAdmin(
    req: IUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const user: UserModel | null = await UserModel.findOne({ where: { id } });

      // Check if user exists
      if (!user) {
        return responseSignature(res, 400, false, "Invalid request");
      }

      user.role = UserRoles.ADMIN;

      await user.save();

      // Return success response
      return responseSignature(
        res,
        201,
        true,
        "User previlege updated successfully"
      );
    } catch (error) {
      console.error("Error registering user:", error);
      next(error);
    }
  }
}
