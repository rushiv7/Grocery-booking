import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/db";

interface IOrderAttributes {
  id: number;
  user_id: number;
  order_date?: Date;
  total_amount: number;
}

interface IOrderCreationAttributes extends Omit<IOrderAttributes, "id"> {}

export class OrderModel
  extends Model<IOrderAttributes, IOrderCreationAttributes>
  implements IOrderAttributes
{
  public id!: number;
  public user_id!: number;
  public order_date?: Date;
  public total_amount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "order",
    timestamps: true,
  }
);
