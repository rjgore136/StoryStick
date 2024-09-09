import React, { useContext } from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({ blog }) => {
  const shortDescription =
    blog.description.length > 145
      ? blog.description.substr(0, 145) + "..."
      : blog.description;
  const shortTitle =
    blog.title.length > 30 ? blog.title.substr(0, 30) + "..." : blog.title;

  return (
    <article className="post">
      <div className="thumbnail">
        <img
          src={`${import.meta.env.VITE_API_ASSETS_URL}/uploads/${
            blog.thumbnail
          }`}
          alt={blog.title}
        />
      </div>

      <div className="postContent">
        <Link to={`/posts/${blog._id}`}>
          <h3>{shortTitle}</h3>
        </Link>
        <p>{shortDescription}</p>
        <div className="postFooter">
          <PostAuthor authorId={blog.creator} createdAt={blog.createdAt} />
          <Link
            to={`/posts/categories/${blog.category}`}
            className="btn category"
          >
            {blog.category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
