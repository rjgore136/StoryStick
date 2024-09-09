import { useEffect, useState } from "react";
import { posts } from "../assets/data";
import PostItem from "../components/PostItem";
import { useParams } from "react-router-dom";
import axios from "axios";

const CategoryPosts = () => {
  const [blogs, setBlogs] = useState({});
  const { category } = useParams();

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/posts/categories/${category}`
        );
        // console.log(response.data);
        setBlogs(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPostsByCategory();
  }, [category]);

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

export default CategoryPosts;
