import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { UserContext } from "../context/userContext";

const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(
    window.innerWidth > 1200 ? true : false
  );

  const { currentUser } = useContext(UserContext);

  const closeNavBar = () => {
    if (window.innerWidth < 1200) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  return (
    <nav>
      <div className="container nav_container">
        <Link to="/" className="logo" onClick={closeNavBar}>
          <h1>StoryStick</h1>
        </Link>
        {currentUser && isNavShowing && (
          <ul className="nav_menu">
            <li>
              <Link to={`/profile/${currentUser?.id}`} onClick={closeNavBar}>
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavBar}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavBar}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavBar}>
                Logout
              </Link>
            </li>
          </ul>
        )}
        {!currentUser && isNavShowing && (
          <ul className="nav_menu">
            <li>
              <Link to="/authors" onClick={closeNavBar}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavBar}>
                Login
              </Link>
            </li>
          </ul>
        )}
        <button
          className="nav_toggle-btn"
          onClick={() => setIsNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
