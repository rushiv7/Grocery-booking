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
      // Pagination parameters
      const page = parseInt(req.query.page as string) || 1; // Current page number
      const limit = parseInt(req.query.limit as string) || 10; // Number of items per page
      const offset = (page - 1) * limit; // Offset calculation

      const grocery_id = parseInt(req.params?.grocery_id);
      let whereCondition: { grocery_id?: number } = {};

      if (grocery_id) {
        whereCondition = { grocery_id };
      }

      const { count, rows: inventory } = await InventoryModel.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        include: [{ model: GroceryModel }],
      });

      // Calculate total number of pages
      const totalPages = Math.ceil(count / limit);

      return responseSignature(res, 200, true, "Success", {
        totalPages: totalPages,
        totalCount: count,
        items: inventory,
      });
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
