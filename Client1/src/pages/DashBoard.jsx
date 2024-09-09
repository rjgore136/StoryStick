import React, { useState, useContext, useEffect } from "react";
import { posts } from "../assets/data";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import DeletePost from "./DeletePost.jsx";
import axios from "axios";
import Loader from "../components/Loader.jsx";

const DashBoard = () => {
  const [blogs, setBlogs] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  //access controll
  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/posts/users/${currentUser.id}`
        );
        console.log(response.data);
        setBlogs(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <section className="dashboard">
      {blogs.length ? (
        <div className="container dashboard_container">
          {blogs.map((blog) => {
            return (
              <article key={blog._id} className="dashboard_blog">
                <div className="dashboard_blog-info">
                  <div className="dashboard_blog-thumbnail">
                    <img
                      src={`${import.meta.env.VITE_API_ASSETS_URL}/uploads/${
                        blog.thumbnail
                      }`}
                      alt="post"
                    />
                  </div>
                  <h5>{blog.title}</h5>
                </div>
                <div className="dashboard_blog-actions">
                  <Link to={`/posts/${blog._id}`} className="btn sm">
                    View
                  </Link>
                  <Link
                    to={`/posts/${blog._id}/edit`}
                    className="btn sm primary"
                  >
                    Edit
                  </Link>
                  <DeletePost postId={blog._id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">You have no posts yet.</h2>
      )}
    </section>
  );
};

export default DashBoard;
