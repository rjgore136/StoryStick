import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { HttpError } from "../Models/errorModel.js";
import postModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import __dirname from "../services/rootPath.js";
import { log } from "console";

//create a post
//protected
export const createPost = async (req, res, next) => {
  try {
    const { description, title, category } = req.body;
    if (!title || !description || !category) {
      return next(
        new HttpError("Fill in all the details and choose the thumbnail")
      );
    }

    const { thumbnail } = req.files;
    if (thumbnail == null)
      return next(new HttpError("Please upload the thumbnail also!!"));
    //checking the siz of file
    let fileName = thumbnail.name;
    let splittedFile = fileName.split(".");
    let newFile =
      splittedFile[0] + uuid() + "." + splittedFile[splittedFile.length - 1];

    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFile),
      async (error) => {
        if (error) return new HttpError(error);
        else {
          const newPost = await postModel.create({
            title,
            category,
            description,
            thumbnail: newFile,
            creator: req.user.id,
          });

          if (!newPost) {
            return next(new HttpError("Post coldn't be created!!", 422));
          }

          //find user and increment post count by 1;
          const currentUser = await UserModel.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await UserModel.findByIdAndUpdate(req.user.id, {
            posts: userPostCount,
          });
          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

//get all posts
//Unprotected
export const getPosts = async (req, res, next) => {
  try {
    const posts = await postModel.find().sort({ updatedAt: -1 });
    res.status(201).json(posts);
  } catch (e) {
    console.log(e);
    return next(new HttpError(e));
  }
};

//get a single post
//Unprotected
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const singlePost = await postModel.find({ _id: id });
    if (!singlePost) return next(new HttpError("Post not found!!"));
    res.json(singlePost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//unprotected
//get posts based on category
export const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const postsByCat = await postModel
      .find({ category })
      .sort({ updatedAt: -1 });
    if (!postsByCat)
      return next(
        new HttpError(`Posts not found with ${category} category !!`)
      );
    res.json(postsByCat);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//unprotected
//get posts based on authors
export const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    const postsByCreator = await postModel
      .find({ creator: id })
      .sort({ updatedAt: -1 });
    console.log(postsByCreator);

    if (!postsByCreator)
      return next(new HttpError(`Posts not found for this user !!`));
    res.status(200).json(postsByCreator);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//edit post
//protected
export const editPost = async (req, res, next) => {
  try {
    let updatedPost;
    const { title, category, description } = req.body;
    const { id } = req.params;

    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const oldPost = await postModel.findById(id);

    if (req.user.id == oldPost.creator) {
      if (!req.files) {
        updatedPost = await postModel.findByIdAndUpdate(
          id,
          { title, category, description },
          { new: true }
        );
        if (!updatedPost) {
          return next(new HttpError("Couldn't update the post!!"));
        }
        res.json(`Post with id ${id} updated successfully`);
      } else {
        //get the old thumbnail from db
        const oldPost = await postModel.findById(id);
        console.log(oldPost);

        //delete old thumbnail from uploads
        fs.unlink(
          path.join(__dirname, "..", "uploads", oldPost.thumbnail),
          async (err) => {
            if (err) {
              console.log(err);
              return next(new HttpError(err));
            }
          }
        );

        //upload new thumbnail
        const { thumbnail } = req.files;
        console.log(thumbnail);
        if (thumbnail.size > 2000000) {
          return next(
            new HttpError("Thumbnail too big.Should be less than 2MB")
          );
        }

        let fileName = thumbnail.name;
        let splittedFileName = fileName.split(".");
        let newFileName =
          splittedFileName[0] +
          uuid() +
          "." +
          splittedFileName[splittedFileName.length - 1];

        thumbnail.mv(
          path.join(__dirname, "..", "uploads", newFileName),
          async (err) => {
            console.log(err);
            if (err) return next(new HttpError(err));
          }
        );

        updatedPost = await postModel.findByIdAndUpdate(
          id,
          { title, category, description, thumbnail: newFileName },
          { new: true }
        );

        if (!updatedPost)
          return next(new HttpError("Couldn't update the post!!"));
        res.json(`Post with id ${id} updated successfully`);
      }
    } else {
      return next(new HttpError("Post couldn't be updated!!"));
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError(error));
  }
};

//Delete post
//protected
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    if (!id) return next(new HttpError("Please provide the postID"));

    const post = await postModel.findById(id);
    console.log(post);

    const fileName = post?.thumbnail;

    if (req.user.id == post?.creator) {
      // delete the thumbnail from uploads
      fs.unlink(
        path.join(__dirname, "..", "uploads", fileName),
        async (err) => {
          if (err) {
            console.log(err);
            return next(new HttpError(err));
          } else {
            await postModel.findByIdAndDelete(id);
            //find use and reduce post count by 1;
            const currentUser = await UserModel.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await UserModel.findByIdAndUpdate(req.user.id, {
              posts: userPostCount,
            });
            res.json(`Post with id ${id} deleted successfully.`);
          }
        }
      );
    } else {
      return next(new HttpError("Post couldn't be deleted!!"));
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError(error));
  }
};
