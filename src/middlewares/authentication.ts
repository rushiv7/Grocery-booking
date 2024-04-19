import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  IUserAuthInfoRequest,
  jwtSecret,
  responseSignature,
} from "../utils/constants";
import { UserRoles } from "../utils/enums";

export const authenticate = (authenticateFor = UserRoles.USER) => {
  return (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res
          .status(401)
          .cookie("token", null)
          .json({ message: "Unauthorized" });
      }

      // Verify JWT token
      const verified = jwt.verify(token, jwtSecret);

      if (!verified) {
        return responseSignature(
          res,
          401,
          false,
          "Unauthorized: Invalid token"
        );
      }

      const decodedInfo: any = jwt.decode(token);

      req.user = decodedInfo;

      // authentication for admin role
      if (
        authenticateFor == UserRoles.ADMIN &&
        req?.user?.role !== UserRoles.ADMIN
      ) {
        return res
          .status(401)
          .cookie("token", null)
          .json({ message: "Unauthorized" });
      }

      next();
    } catch (error) {
      console.error(error);
      // For any other error
      return responseSignature(res, 401, false, "Unauthorized: Invalid token");
    }
  };
};
