import React, { useState, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import Swal from "sweetalert2";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  //access controll
  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/login");
    }
  }, []);

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
    "Buisness",
    "Education",
    "Entertainment",
    "Investment",
    "Weather",
  ];

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/posts/${id}`
        );
        if (!response)
          setError(
            "Couldn't fetch the previous details!Plase update post from beggining."
          );
        setTitle(response.data[0].title);
        setCategory(response.data[0].category);
        setDescription(response.data[0].description);
      } catch (err) {
        console.log(err);
        setError(err.response.data.message);
      }
    };
    getPost();
  }, []);

  const editPost = async (e) => {
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

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/edit-post/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        await Swal.fire({
          title: "Updated Successfully!",
          text: `Successfully updated the post with id ${id}`,
          icon: "success",
        });
        return navigate(`/posts/${id}`);
      } else {
        console.log(response.status);
      }
    } catch (err) {
      await Swal.fire({
        title: "Failed to update!",
        text: `Couldn't update the post!!`,
        icon: "error",
      });
      console.log(err);
      setError(err.response.data.message);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit post</h2>
        {error && <p className="form_error-msg">{error}</p>}
        <form className="form create-post_form" onSubmit={editPost}>
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
            onChange={setDescription}
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png,jpg,jpeg"
          />
          <button type="submit" className="btn primary">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
