import { Request } from "express";
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
