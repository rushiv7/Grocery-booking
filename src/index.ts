import express, { Application, Request, Response } from "express";
import sequelize from "./utils/db";
import authRouter from "./routers/auth.router";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";
import groceryRouter from "./routers/grocery.router";
import inventoryRouter from "./routers/inventory.router";
import { responseSignature } from "./utils/constants";
require("dotenv").config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || "3000");
app.use(express.json());
app.use(cookieParser());

// check db connection
const checkDbConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  responseSignature(res, 200, true, "Done");
});

app.use("/auth", authRouter);
app.use("/grocery", groceryRouter);
app.use("/inventory", inventoryRouter);

// Fallback route
app.use((req, res) => {
  responseSignature(res, 404, false, "");
});

app.listen(port, async () => {
  console.log("Connecting database...");
  await checkDbConnection();

  console.log(`Server started on port ${port}`);
});
