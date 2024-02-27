import { UserModel } from "../../models/User";

interface UserObj {
  _id: string;
  username: string;
  password: string;
  name: string;
}

type CreateNewUser = (username: string, password: string) => Promise<boolean>;
type FindExisting = (
  username: string,
  password: string
) => Promise<UserObj | null>;
type GetByUserName = (username: string) => Promise<UserObj | null>;

const createNewUser: CreateNewUser = async (username, password) => {
  try {
    const newUser = new UserModel({
      username: username,
      password: password,
      name: username,
    });
    await newUser.save();
    return true;
  } catch (error: any) {
    throw error;
  }
};
const findExistingUser: FindExisting = async (username, password) => {
  return await UserModel.findOne({ username, password });
};
const getUserByUsername: GetByUserName = async (username) => {
  console.log(username);
  try {
    return await UserModel.findOne({ username });
  } catch (E) {
    throw E;
  }
};

export { createNewUser, findExistingUser, getUserByUsername };
