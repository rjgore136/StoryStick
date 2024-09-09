import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const PostAuthor = ({ authorId, createdAt }) => {
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/${authorId}`
        );
        // console.log(response.data);
        setAuthor(response?.data.message);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAuthor();
    // console.log(createdAt);
  }, [authorId]);

  const date = new Date(createdAt);

  return (
    <Link to={`posts/users/${authorId}`} className="postAuthor">
      <div className="postAuthor_avatar">
        <img
          src={`${import.meta.env.VITE_API_ASSETS_URL}/uploads/${
            author?.avatar
          }`}
          alt="avatar"
        />
      </div>
      <div className="postAuthor_details">
        <h5>By: {author?.name}</h5>
        <small>
          <ReactTimeAgo
            date={!isNaN(date) ? date : new Date()}
            locale="en-US"
          />
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;
