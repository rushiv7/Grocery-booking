import { NextFunction, Request, Response } from "express";
import { GroceryModel } from "../models";
import { responseSignature } from "../utils/constants";

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
      const { item_name, description, price } = req.body;

      if (!item_name || !description || isNaN(price)) {
        return responseSignature(res, 403, false, "Invalid Body");
      }

      const newGrocery = await GroceryModel.create({
        item_name,
        description,
        price,
      });

      return responseSignature(res, 201, false, "Success", newGrocery);
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

      const deletedRows = await GroceryModel.destroy({
        where: { id },
      });

      if (deletedRows === 0) {
        return responseSignature(res, 404, false, "Grocery not found");
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
