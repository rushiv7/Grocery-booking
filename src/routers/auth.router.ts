import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authentication";

const authRouter: Router = Router();
const authController = new AuthController();

authRouter.post("/register", authController.registerUser);
authRouter.post("/signin", authController.signIn);

authRouter.post(
  "/admin/previlege/:id",
  authenticate(),
  authController.promoteToAdmin
);

export default authRouter;
