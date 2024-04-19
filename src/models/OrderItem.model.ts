import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/db";

interface IOrderItemAttributes {
  id?: number;
  order_id: number;
  grocery_id: number;
  quantity: number;
  subtotal: number;
}

interface IOrderItemCreationAttributes
  extends Omit<IOrderItemAttributes, "id"> {}

export class OrderItemModel
  extends Model<IOrderItemAttributes, IOrderItemCreationAttributes>
  implements IOrderItemAttributes
{
  public id?: number;
  public order_id!: number;
  public grocery_id!: number;
  public quantity!: number;
  public subtotal!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderItemModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    grocery_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "order_items",
    timestamps: true,
  }
);
