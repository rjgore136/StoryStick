import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const authorsData = [
  {
    id: 1,
    avatar: "/images/avatar11.jpg",
    name: "Monkey D.Luffy",
    posts: 3,
  },
  {
    id: 2,
    avatar: "/images/avatar11.jpg",
    name: "Red Haired Shanks",
    posts: 2,
  },
  {
    id: 3,
    avatar: "/images/avatar11.jpg",
    name: "Buggy The Clown",
    posts: 7,
  },
  {
    id: 4,
    avatar: "/images/avatar11.jpg",
    name: "Marshel D.Teach",
    posts: 3,
  },
  {
    id: 5,
    avatar: "/images/avatar11.jpg",
    name: "Roronoa Zoro",
    posts: 6,
  },
];

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAuhtors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users`
        );
        // console.log(response.data);
        setAuthors(response.data.authors);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchAuhtors();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors_container">
          {authors.map((author) => {
            return (
              <Link
                to={`/posts/users/${author._id}`}
                key={author._id}
                className="author"
              >
                <div className="author_avatar">
                  <img
                    src={`${import.meta.env.VITE_API_ASSETS_URL}/uploads/${
                      author.avatar
                    }`}
                    alt={author.name}
                  />
                </div>
                <div className="author_info">
                  <h4>{author.name}</h4>
                  <p>{author.posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No Authors found</h2>
      )}
    </section>
  );
};

export default Authors;
