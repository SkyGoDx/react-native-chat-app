import { Request, Response } from "express";
import {
  findAllChatsById,
  insertUserChats,
  updateUserChats,
} from "./chats.services";

export const fetchChats = async (req: Request, res: Response) => {
  const allChats = await findAllChatsById(req.params.id);
  if (!allChats)
    return res.status(404).json({ result: 0, msg: "No data found..." });
  return res.json({
    return: 1,
    userChats: allChats,
  });
};

export const saveUserChats = async (req: Request, res: Response) => {
  const save = await insertUserChats(req.body);
  return res.json({
    result: 1,
    msg: "user chats saved successfully",
  });
};

export const updateController = async (req: Request, res: Response) => {
  const { userMessages } = req.body;
  console.log("user messaged", userMessages)
  const update = await updateUserChats(req.params.id, userMessages);
  return res.json({
    result: 1,
    msg: "user chat updated successfully"
  })
};
