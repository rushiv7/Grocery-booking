import { Sequelize } from "sequelize";
require("dotenv").config();

// Initialize Sequelize with SQLite dialect
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_PATH, // SQLite database file path
});

export default sequelize;
