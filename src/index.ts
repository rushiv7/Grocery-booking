import express, { Application, Request, Response } from "express";
import sequelize from "./utils/db";
import authRouter from "./routers/auth.router";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler";

const app: Application = express();
const port: number = parseInt(process.env.PORT || "3000");
app.use(express.json())
app.use(cookieParser());

// check db connection
const checkDbConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Done");
});

app.use("/auth", authRouter);

// Fallback route
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, async () => {
  console.log("Connecting database...");
  await checkDbConnection();

  console.log(`Server started on port ${port}`);
});
