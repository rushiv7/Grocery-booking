import { Model, DataTypes } from "sequelize";
import sequelize from "../utils/db";
import { UserRoles } from "../utils/enums";

interface IUserAttributes {
  id?: number;
  email: string;
  password: string;
  role?: UserRoles;
}

interface IUserCreationAttributes extends Omit<IUserAttributes, "id"> {}

export class UserModel
  extends Model<IUserAttributes, IUserCreationAttributes>
  implements IUserAttributes
{
  public id?: number;
  public email!: string;
  public password!: string;
  public role?: UserRoles;

  // Timestamp fields if needed
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: UserRoles.USER,
    },
  },
  {
    sequelize,
    tableName: "user",
    timestamps: true,
  }
);
