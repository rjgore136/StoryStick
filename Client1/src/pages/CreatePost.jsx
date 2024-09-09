import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState(null);

  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  //access controll
  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const POST_CATEGORIES = [
    "Uncategorized",
    "Agriculture",
    "Art",
    "Business",
    "Education",
    "Entertainment",
    "Investment",
    "Weather",
  ];

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("category", category);
      formData.set(
        "description",
        description.replace(/<p>/g, "").replace(/<\/p>/g, "")
      );
      formData.set("thumbnail", thumbnail);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/createPost`,
        formData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      if (response.status == 201) {
        await Swal.fire({
          title: "Post Creation",
          text: "Successfully created the post!!",
          icon: "success",
        });
        return navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create post</h2>
        {error && <p className="form_error-msg">{error}</p>}
        <form onSubmit={createPost} className="form create-post_form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select
            name="category"
            id=""
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((category) => {
              return <option key={category}>{category}</option>;
            })}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={(content) => setDescription(content)}
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png,jpg,jpeg"
          />
          <button type="submit" className="btn primary">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
