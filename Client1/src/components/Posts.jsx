import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import axios from "axios";
import Loader from "./Loader";

const Posts = () => {
  const [blogs, setBlogs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/posts`
        );
        // console.log(response.data);
        setBlogs(response?.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchBlogs();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <section className="posts">
      {/* {isLoading && <Loader />} */}
      {blogs && (
        <div className="container posts_container">
          {blogs.length > 0 ? (
            blogs.map((blog) => <PostItem key={blog._id} blog={blog} />)
          ) : (
            <h2 className="center">No blogs found!!</h2>
          )}
        </div>
      )}
    </section>
  );
};

export default Posts;
