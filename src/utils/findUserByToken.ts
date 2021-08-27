import jwt from "jsonwebtoken";
import UserModel from "../users/model/user.model";
import IUser from "../users/user.interface";

export const findUserByToken = async (token: string): Promise<IUser | null> => {
  const decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY || "");
  if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
    const userId = decoded["id"];
    const user = await UserModel.findById(userId);
    return user;
  }
  return null;
};
