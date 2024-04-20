import { Router } from "express";
import { authenticate } from "../middlewares/authentication";
import OrderController from "../controllers/order.controller";

const orderRouter: Router = Router();
const orderController = new OrderController();

orderRouter.get("/", authenticate(), orderController.getAllOrders);
orderRouter.post("/place", authenticate(), orderController.placeOrder);

export default orderRouter;
