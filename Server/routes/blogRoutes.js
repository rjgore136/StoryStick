import express from "express";
import {
  createPost,
  deletePost,
  editPost,
  getCatPosts,
  getPost,
  getPosts,
  getUserPosts,
} from "../Controllers/postController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const blogRouter = express.Router();

blogRouter.get("/", getPosts);
blogRouter.get("/:id", getPost);
blogRouter.post("/createPost", authMiddleware, createPost);
blogRouter.get("/categories/:category", getCatPosts);
blogRouter.get("/users/:id", getUserPosts);
blogRouter.patch("/edit-post/:id", authMiddleware, editPost);
blogRouter.delete("/delete-post/:id", authMiddleware, deletePost);

export default blogRouter;
