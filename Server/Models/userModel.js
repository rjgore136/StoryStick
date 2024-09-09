import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  posts: { type: Number, default: 0 },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
