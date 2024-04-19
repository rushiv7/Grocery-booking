import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/db";

interface IInventoryAttributes {
  id?: number;
  grocery_id: number;
  quantity: number;
}

interface IInventoryCreationAttributes
  extends Omit<IInventoryAttributes, "id"> {}

export class InventoryModel
  extends Model<IInventoryAttributes, IInventoryCreationAttributes>
  implements IInventoryAttributes
{
  public id?: number;
  public grocery_id!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

InventoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    grocery_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "inventory",
    timestamps: true,
  }
);
