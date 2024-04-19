import { NextFunction, Request, Response } from "express";
import { responseSignature } from "../utils/constants";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof SyntaxError && "body" in err) {
    return responseSignature(res, 400, false, "Invalid Body");
  }

  return responseSignature(res, 500, false, "Internal server error");
};
