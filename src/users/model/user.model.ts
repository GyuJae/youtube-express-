import { model, Schema } from "mongoose";
import IUser from "../user.interface";

const schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

const UserModel = model<IUser>("User", schema);

export default UserModel;
