import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { UserContext } from "../context/userContext";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const changeInputHandler = (e) => {
    e.preventDefault();
    const { name } = e.target;
    const { value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();
    //setting the error null every time new req hits
    setError("");
    try {
      //sending the api req using axios
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        userData
      );

      const currUser = response.data.name;
      console.log(response);

      //checking if we got any response or not
      if (!currUser) {
        setError("Login failed.Please try again!!");
        await Swal.fire({
          title: " Couldn't sign in!!",
          text: "Couldn't sign in .Please try again!!",
          icon: "error",
        });
      }

      //saving the token in local storage using currentUser
      setCurrentUser(response.data);
      await Swal.fire({
        title: "Signed in successfully!",
        text: `Welcome back ${currUser}`,
        icon: "success",
      });

      //navigating to the home  page
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  // useEffect(() => {
  //   console.log(userData);
  // }, [userData]);
  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login_form" onSubmit={loginUser}>
          {error && <p className="form_error-msg">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn primary">
            Login
          </button>
        </form>
        <small>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
