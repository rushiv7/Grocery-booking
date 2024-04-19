import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/db";

interface IGroceryAttributes {
  id?: number;
  item_name: string;
  description: string;
  price: number;
}

interface IGroceryCreationAttributes extends Omit<IGroceryAttributes, "id"> {}

export class GroceryModel
  extends Model<IGroceryAttributes, IGroceryCreationAttributes>
  implements IGroceryAttributes
{
  public id?: number;
  public item_name!: string;
  public description!: string;
  public price!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GroceryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "grocery",
    timestamps: true,
  }
);
