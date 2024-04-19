import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserRoles } from "./enums";

export const jwtSecret = process.env.JWT_SECRET || "LMAUWRFYS";

export interface IUserAuthInfoRequest extends Request {
  user?:
    | {
        userId: number;
        role: UserRoles;
      }
    | null
    | JwtPayload;
}

interface IAPIResponse {
  message: string;
  success?: boolean;
  data?: object;
}

export const responseSignature = (
  res: Response,
  statusCode: number,
  success: boolean = false,
  message: string = "",
  data?: any
) => {
  const response: IAPIResponse = {
    message,
    success,
  };

  if (data) response.data = data;

  return res.status(statusCode).json(response);
};
