import React from "react";
import { useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Swal from "sweetalert2";

const DeletePost = ({ postId }) => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // access controll
  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/login");
    }
  }, []);

  const deletePost = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/posts/delete-post/${postId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );

      if (response.status == 200) {
        if (location.pathname == `/myposts/${currentUser.id}`) {
          navigate(0);
        } else {
          await Swal.fire({
            title: "Deleted Successfully!",
            text: `Successfully deleted the post with id ${postId}`,
            icon: "success",
          });
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      console.log("Couldn't delete the post!!");
    }
  };

  return (
    <Link className="btn btn-sm danger" onClick={deletePost}>
      Delete
    </Link>
  );
};

export default DeletePost;
