import { Router } from "express";
import { authenticate } from "../middlewares/authentication";
import { UserRoles } from "../utils/enums";
import InventoryController from "../controllers/inventory.controller";

const inventoryRouter: Router = Router();
const inventoryController = new InventoryController();

inventoryRouter.get(
  "/:grocery_id",
  authenticate(UserRoles.ADMIN),
  inventoryController.getInventory
);
inventoryRouter.put(
  "/:grocery_id",
  authenticate(UserRoles.ADMIN),
  inventoryController.updateInventory
);

export default inventoryRouter;
