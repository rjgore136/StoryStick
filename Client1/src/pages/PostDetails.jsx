import React, { useContext, useEffect, useState } from "react";
import PostAuthor from "../components/PostAuthor.jsx";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import axios from "axios";
import DeletePost from "./DeletePost.jsx";
import Loader from "../components/Loader.jsx";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/posts/${id}`
        );
        console.log(response.data[0]);
        setPost(response.data[0]);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };
    getPost();
  }, []);

  // useEffect(() => {
  //   console.log(`creator: ${currentUser.id}`);
  //   console.log(typeof currentUser.id);
  //   console.log(typeof post?.creator);
  //   console.log(post);
  // }, [post]);

  if (isLoading) return <Loader />;

  return (
    <section className="post-detail">
      {error && <p className="form_error-msg">{error}</p>}

      {post && (
        <div className="container post-detail_container">
          <div className="post-detail_header">
            <PostAuthor authorId={post?.creator} createdAt={post?.createdAt} />

            {currentUser?.id == post?.creator && (
              <div className="post-detail_buttons">
                <Link to={`/posts/${[id]}/edit`} className="btn btn-sm primary">
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{post?.title}</h1>
          <div className="post-detail_thumbnail">
            <img
              src={`${import.meta.env.VITE_API_ASSETS_URL}/uploads/${
                post.thumbnail
              }`}
              alt="avatar"
            />
          </div>
          <p dangerouslySetInnerHTML={{ __html: post?.description }}></p>
        </div>
      )}
    </section>
  );
};

export default PostDetails;
