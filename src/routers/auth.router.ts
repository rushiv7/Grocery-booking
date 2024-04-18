import { Router } from "express";
import UserController from "../controllers/user.controller";

const authRouter: Router = Router();
const userController = new UserController();

authRouter.post("/register", userController.registerUser);

export default authRouter;
