import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/db";

interface IInventoryAttributes {
  id?: number;
  groceryId: number;
  quantity: number;
  lastUpdated: Date;
}

interface IInventoryCreationAttributes
  extends Omit<IInventoryAttributes, "id"> {}

export class InventoryModel
  extends Model<IInventoryAttributes, IInventoryCreationAttributes>
  implements IInventoryAttributes
{
  public id?: number;
  public groceryId!: number;
  public quantity!: number;
  public lastUpdated!: Date;

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
    groceryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "inventory",
    timestamps: true,
  }
);
