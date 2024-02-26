import { Router } from "express";
import { createUser, searchUser, userLogin } from "./user.controller";
import { withErrorHandling } from "../../handlers/errorHandlers";
// import { authentication } from "../../middleware/auth";

const userRouter: Router = Router();

userRouter.post("/login",  userLogin);
userRouter.post("/create",  createUser);
userRouter.get("/s",  searchUser);

export { userRouter };
