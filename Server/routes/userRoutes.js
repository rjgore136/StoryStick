import express from "express";
import {
  changeAvatar,
  editUser,
  getAuthors,
  getUser,
  loginUser,
  registerUser,
} from "../Controllers/userController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/:id", getUser);
userRouter.get("/", getAuthors);
userRouter.post("/change-avatar", authMiddleware, changeAvatar);
userRouter.patch("/edit-user", authMiddleware, editUser);

export default userRouter;
