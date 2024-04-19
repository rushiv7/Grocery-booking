import { Router } from "express";
import GroceryController from "../controllers/grocery.controller";
import { authenticate } from "../middlewares/authentication";
import { UserRoles } from "../utils/enums";

const groceryRouter: Router = Router();
const groceryController = new GroceryController();

groceryRouter.get("/", authenticate(), groceryController.getAllGroceries);
groceryRouter.post(
  "/",
  authenticate(UserRoles.ADMIN),
  groceryController.addGrocery
);
groceryRouter.put(
  "/:id",
  authenticate(UserRoles.ADMIN),
  groceryController.updateGrocery
);
groceryRouter.delete(
  "/:id",
  authenticate(UserRoles.ADMIN),
  groceryController.deleteGrocery
);

export default groceryRouter;
