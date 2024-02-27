import { Router } from "express";
import { fetchChats, saveUserChats, updateController } from "./chats.controller";

const chatRouter = Router();

chatRouter.get("/:id", fetchChats)
chatRouter.post("/add", saveUserChats)
chatRouter.put("/:id", updateController)

export {chatRouter};