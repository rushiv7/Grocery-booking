import { GroceryModel } from "./Grocery.model";
import { InventoryModel } from "./Inventory.model";
import { OrderModel } from "./Order.model";
import { OrderItemModel } from "./OrderItem.model";
import { UserModel } from "./User.model";

// Associations

// Inventory
GroceryModel.hasOne(InventoryModel, { foreignKey: "grocery_id" });
InventoryModel.belongsTo(GroceryModel, { foreignKey: "grocery_id" });

// Order
UserModel.hasMany(OrderModel, { foreignKey: "user_id" });
OrderModel.belongsTo(UserModel, { foreignKey: "user_id" });

// OrderItem
OrderModel.hasMany(OrderItemModel, { foreignKey: "order_id" });
OrderItemModel.belongsTo(OrderModel, { foreignKey: "order_id" });

GroceryModel.hasOne(OrderItemModel, { foreignKey: "grocery_id" });
OrderItemModel.belongsTo(GroceryModel, { foreignKey: "grocery_id" });

export { UserModel, GroceryModel, InventoryModel, OrderModel, OrderItemModel };
