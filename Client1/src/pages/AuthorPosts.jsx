import React, { useEffect, useState } from "react";
import { posts } from "../assets/data";
import PostItem from "../components/PostItem";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const AuthorPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  console.log(id);

  useEffect(() => {
    const fetchPostsByUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/posts/users/${id}`
        );
        // console.log(response.data);
        setBlogs(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchPostsByUser();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <section className="author-posts">
      <div className="container posts_container">
        {blogs.length > 0 ? (
          blogs.map((blog) => <PostItem key={blog._id} blog={blog} />)
        ) : (
          <h2 className="center">No blogs found!!</h2>
        )}
      </div>
    </section>
  );
};

export default AuthorPosts;
