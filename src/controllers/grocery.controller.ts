import { NextFunction, Request, Response } from "express";
import { GroceryModel, InventoryModel } from "../models";
import { responseSignature } from "../utils/constants";
import { Sequelize } from "sequelize";

export default class GroceryController {
  constructor() {}

  /*
  Get all groceries
  */
  async getAllGroceries(req: Request, res: Response, next: NextFunction) {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page as string) || 1; // Current page number
      const limit = parseInt(req.query.limit as string) || 10; // Number of items per page

      // Offset calculation
      const offset = (page - 1) * limit;
      const { count, rows: groceries } = await GroceryModel.findAndCountAll({
        attributes: [
          "id",
          "item_name",
          "description",
          "price",
          [Sequelize.col("InventoryModel.quantity"), "available_qty"],
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: InventoryModel,
            attributes: [],
          },
        ],
        limit,
        offset,
      });

      // Calculate total number of pages
      const totalPages = Math.ceil(count / limit);

      return responseSignature(res, 200, true, "Success", {
        totalPages: totalPages,
        totalCount: count,
        items: groceries,
      });
    } catch (error) {
      console.error("Error fetching groceries:", error);
      next(error);
    }
  }

  /*
  Add a new grocery
  */
  async addGrocery(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_name, description, price, quantity } = req.body;

      if (!item_name || !description || isNaN(price)) {
        return responseSignature(res, 403, false, "Invalid Body");
      }

      const newGrocery = await GroceryModel.create({
        item_name,
        description,
        price,
      });

      if (newGrocery.id) {
        // Create inventory entry for the grocery item
        await InventoryModel.create({
          grocery_id: newGrocery.id,
          quantity: quantity || 0,
        });
      }

      return responseSignature(
        res,
        201,
        true,
        "Grossary added successfully",
        newGrocery
      );
    } catch (error) {
      console.error("Error adding grocery:", error);
      next(error);
    }
  }

  /*
  Delete a grocery
  */
  async deleteGrocery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const grocery = await GroceryModel.findByPk(id);

      if (!grocery) {
        return responseSignature(res, 404, false, "Grocery not found");
      }

      // Find the associated inventory entry
      const inventory = await InventoryModel.findOne({
        where: { grocery_id: id },
      });

      await grocery.destroy();

      if (inventory) {
        // Delete the associated inventory entry if it exists
        await inventory.destroy();
      }

      return responseSignature(res, 204, true, "");
    } catch (error) {
      console.error("Error deleting grocery:", error);
      next(error);
    }
  }

  /*
  Update a grocery
  */
  async updateGrocery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { item_name, description, price } = req.body;

      const [updatedRows] = await GroceryModel.update(
        { item_name, description, price },
        { where: { id } }
      );

      if (updatedRows === 0) {
        return responseSignature(res, 404, false, "Grocery not found");
      }

      const updatedGrocery = await GroceryModel.findByPk(id);
      return responseSignature(
        res,
        200,
        true,
        "Updated Successfully",
        updatedGrocery
      );
    } catch (error) {
      console.error("Error updating grocery:", error);
      next(error);
    }
  }
}
