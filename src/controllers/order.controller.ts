import { NextFunction, Response } from "express";
import {
  OrderModel,
  OrderItemModel,
  GroceryModel,
  InventoryModel,
} from "../models";
import { IUserAuthInfoRequest, responseSignature } from "../utils/constants";
import { UserRoles } from "../utils/enums";
import sequelize from "../utils/db";

export default class OrderController {
  constructor() {}

  /*
  Place a new order
*/
  async placeOrder(
    req: IUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ) {
    const user_id = req.user?.user_id || -1;
    const { items } = req.body;

    if (user_id < 0) {
      return responseSignature(res, 400, false, "Invalid request");
    }

    const t = await sequelize.transaction();

    try {
      // Create a new order
      const newOrder = await OrderModel.create(
        {
          user_id,
          total_amount: 0, // Will be updated after adding order items
        },
        { transaction: t }
      );
      console.log("order created");

      // Check inventory availability for each item and create order items
      let orderItems: OrderItemModel[] = [];

      for (let item of items) {
        console.log("mapping items");

        const { grocery_id, quantity } = item;

        if (quantity < 0) {
          await t.rollback();
          return responseSignature(res, 400, false, "Invalid quantity");
        }

        // Find grocery item
        const grocery = await GroceryModel.findByPk(grocery_id, {
          transaction: t,
        });

        console.log("found grossary item: ", grocery);

        if (!grocery) {
          await t.rollback();
          return responseSignature(res, 404, false, "Grocery not found");
        }

        // Find the corresponding inventory
        const inventory = await InventoryModel.findOne({
          where: { grocery_id: grocery_id },
          transaction: t,
        });

        if (!inventory) {
          await t.rollback();
          return responseSignature(
            res,
            404,
            false,
            "Inventory not found for item"
          );
        }

        console.log("found inventory item: ", inventory);

        // Check if enough inventory available
        if (inventory.quantity < quantity) {
          await t.rollback();
          return responseSignature(
            res,
            501,
            false,
            `Not enough inventory available for grocery item ${grocery.item_name}`
          );
        }

        // Calculate subtotal
        const subtotal = quantity * grocery.price;

        // Create order item
        const newOrderItem = await OrderItemModel.create(
          {
            order_id: newOrder.id,
            grocery_id,
            quantity,
            subtotal,
          },
          { transaction: t }
        );

        // Reduce inventory count
        await inventory.update(
          { quantity: inventory.quantity - quantity },
          { transaction: t }
        );

        orderItems.push(newOrderItem);
      }

      // Calculate total amount
      const total_amount = orderItems.reduce(
        (acc, item) => acc + item.subtotal,
        0
      );

      // Update total amount in the order
      await newOrder.update({ total_amount }, { transaction: t });

      // Commit the transaction
      await t.commit();

      return responseSignature(res, 201, true, "Order placed successfully", {
        order_id: newOrder.id,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      await t.rollback(); // Rollback
      next(error);
    }
  }

  /*
  Get all orders
  */
  async getAllOrders(
    req: IUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page as string) || 1; // Current page number
      const limit = parseInt(req.query.limit as string) || 10; // Number of items per page
      const offset = (page - 1) * limit; // Offset calculation

      const user_id = req.user?.user_id || -1;
      let whereCondition: { user_id?: number } = { user_id };

      if (user_id < 0) {
        return responseSignature(res, 400, false, "Invalid request");
      }

      // Remove user_id filter for ADMIN
      if (req.user?.role == UserRoles.ADMIN) {
        whereCondition = {};
      }

      const { count, rows: orders } = await OrderModel.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        include: [
          { model: OrderItemModel, include: [{ model: GroceryModel }] },
        ],
        distinct: true, // Total count issue fix
      });

      // Calculate total number of pages
      const totalPages = Math.ceil(count / limit);

      return responseSignature(res, 200, true, "Success", {
        totalPages: totalPages,
        totalCount: count,
        items: orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      next(error);
    }
  }
}
