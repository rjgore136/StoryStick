import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import { HttpError } from "../Models/errorModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import path from "path";
import __dirname from "../services/rootPath.js";

dotenv.config();

//register controller
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;

    //checking if the input fields are empty
    if (!name || !email || !password) {
      return next(new HttpError("Fill in all fields.", 422));
    }

    const newEmail = email.toLowerCase();

    //checking if email alredy exist in the db
    const emailExists = await UserModel.findOne({ email: newEmail });
    // console.log(emailExists);

    if (emailExists) {
      return next(new HttpError("Email already exists.", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters.", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("Passwords do not match!!", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      name,
      email: newEmail,
      password: hashedPass,
    });
    res.status(201).json(`New user ${newUser.email} registerd`);
  } catch (error) {
    console.log(error);
    return next(new HttpError(error));
  }
};

//Login controller
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(email,password);

    if (!email || !password) {
      return next(new HttpError("Fill in all the fields!", 422));
    }
    const newEmail = email.toLowerCase();
    const user = await UserModel.findOne({ email: newEmail });
    // console.log(user);

    if (!user) return next(new HttpError("Invalid credentials!!", 422));

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) return next(new HttpError("Invalid credentials!!", 422));

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // console.log(token);

    res.status(200).json({ token, id, name });
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Login failed! Please check your crendentials.", 422)
    );
  }
};

//get user details
//Protected - will show only if the user is loged in
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-password");
    if (!user) return next(new HttpError("User Not Found!!", 404));
    res.status(200).json({ success: true, message: user });
  } catch (error) {
    return next(new HttpError(error));
  }
};

export const changeAvatar = async (req, res, next) => {
  try {
    console.log(req.files.avatar);

    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image!", 422));
    }

    //find user in db
    // console.log(req.user);
    const user = await UserModel.findById(req.user.id);

    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (error) => {
        if (error) return next(new HttpError(error));
      });
    }

    const { avatar } = req.files;
    if (avatar.size > 5000000)
      return next(
        new HttpError("Picture is too big.Should be less than 500kb!")
      );

    let fileName = avatar.name;
    let splittedFile = fileName.split(".");
    let newFileName =
      splittedFile[0] + uuid() + "." + splittedFile[splittedFile.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (error) => {
        if (error) return next(new HttpError(error));

        const updatedAvatar = await UserModel.findByIdAndUpdate(
          req.user.id,
          { avatar: newFileName },
          { new: true }
        );

        if (!updatedAvatar)
          return next(new HttpError("Avatar couldn't be changed !!"));

        res.status(200).json({ success: true, updatedAvatar });
      }
    );
  } catch (error) {
    console.log(error);
    return next(new HttpError(error.message));
  }
};

export const editUser = async (req, res, next) => {
  const { name, email, currentPass, newPass, confirmNewPass } = req.body;
  console.log(name, email, currentPass, newPass, confirmNewPass);
  if (!name || !email || !currentPass || !newPass) {
    return next(new HttpError("Fill in all fields!", 422));
  }

  //get user from database
  const user = await UserModel.findById(req.user.id);

  if (!user) return next(new HttpError("User not found!!"));

  //we want to update the other details with or without changing the email (which is unique id ,which we use it to login)
  const emailExists = await UserModel.findOne({ email });
  if (emailExists && emailExists._id != req.user.id) {
    return next(new HttpError("Email already exits!!"));
  }

  //comparing current password to db password
  const validatePass = await bcrypt.compare(currentPass, user.password);
  if (!validatePass) {
    return next(new HttpError("Invalid current password!!", 422));
  }

  //compare new passwords
  if (newPass !== confirmNewPass) {
    return next(new HttpError("New passwords do not match!!"), 422);
  }

  //hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(newPass, salt);

  //save the new details in the db
  const newInfo = await UserModel.findByIdAndUpdate(
    req.user.id,
    { name, email, password: hashPass },
    { new: true }
  );
  res.json({ success: true, newInfo });
};

export const getAuthors = async (req, res, next) => {
  try {
    const authors = await UserModel.find().select("-password");
    if (authors.length < 1) return next(new HttpError("No authors found!"));
    res.status(200).json({ success: true, authors });
  } catch (e) {
    // console.log(e.message);
    return next(new HttpError(e.message));
  }
};
