import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authenticate } from "../middlewares/authentication";

const authRouter: Router = Router();
const userController = new UserController();

authRouter.post("/register", userController.registerUser);
authRouter.post("/signin", userController.signIn);

authRouter.post(
  "/admin/previlege/:id",
  authenticate(),
  userController.promoteToAdmin
);

export default authRouter;
