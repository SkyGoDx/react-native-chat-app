import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { createSecurePass } from "../../utils/utils";
import {
  createNewUser,
  findExistingUser,
  getUserByUsername,
} from "./user.servcie";

interface Body {
  username: string;
  password: string;
}

export type Login = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Record<string, any>>;

const userLogin: Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.body)
  const { username, password }: Body = req.body;
  // console.log(username, [password])
  const securePass = createSecurePass(password);
  const ifExist = await findExistingUser(username, securePass);
  if (!ifExist)
    return res.json({ result: 0, msg: "Username or password is incorrect" });
  // console.log(ifExist)
  const token = jwt.sign({ id: ifExist._id }, process.env.SECRET || "", {
    expiresIn: "1day",
  });
  console.log(token);
  return res.json({
    token,
    result: 1,
    _id: ifExist._id,
  });
};
const createUser = async (req: Request, res: Response) => {
  const { username, password }: Body = req.body;
  const securePass = createSecurePass(password);
  const ifExist = await findExistingUser(username, securePass);
  if (ifExist)
    return res.json({
      result: 2,
      msg: "User Already Exist...",
    });
  const ok = await createNewUser(username, securePass);
  if (ok) {
    return res.json({
      result: 1,
      msg: "User Create " + [username] + " successfuly",
    });
  } else {
    return res.json({
      result: 0,
      msg: "Failed to regester your account.",
    });
  }
};

const searchUser = async (req: Request, res: Response) => {
  const { username } = req.query as { username: string };
  // console.log(username)
  const user = await getUserByUsername(username);
  // console.log("f ->", user)
  if (!user) {
    return res.json({
      result: 0,
      list: [],
    });
  }
  return res.json({
    result: 1,
    list: [user],
  });
};

export { userLogin, createUser, searchUser };
