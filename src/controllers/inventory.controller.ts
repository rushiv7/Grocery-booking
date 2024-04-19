import { NextFunction, Request, Response } from "express";
import { GroceryModel, InventoryModel } from "../models";
import { responseSignature } from "../utils/constants";

export default class InventoryController {
  constructor() {}

  /*
  Get inventory for a specific grocery item
  */
  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { grocery_id } = req.params;

      // Find inventory for the specified grocery item
      const inventory = await InventoryModel.findOne({
        where: { grocery_id },
        include: [{ model: GroceryModel }],
      });

      if (!inventory) {
        return responseSignature(res, 404, false, "Inventory not found");
      }

      return responseSignature(res, 200, true, "Success", inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      next(error);
    }
  }

  /*
  Update inventory for a specific grocery item
  */
  async updateInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { grocery_id } = req.params;
      const { quantity } = req.body;

      if (isNaN(quantity)) {
        return responseSignature(res, 403, false, "Invalid Body");
      }

      let inventory = await InventoryModel.findOne({ where: { grocery_id } });

      if (!inventory) {
        return responseSignature(res, 404, false, "Inventory not found");
      }

      // Update inventory quantity
      inventory.quantity = quantity;

      await inventory.save();

      return responseSignature(
        res,
        200,
        true,
        "Inventory updated successfully"
      );
    } catch (error) {
      console.error("Error updating inventory:", error);
      next(error);
    }
  }
}
