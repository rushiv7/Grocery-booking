import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid Body" });
  }

  res.status(500).json({ message: "Internal server error" });
};
