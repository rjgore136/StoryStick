import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    e.preventDefault();
    const { name } = e.target;
    const { value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();

    //setting the error null every time new req hits
    setError("");
    try {
      //sending the api req using axios
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        userData
      );
      console.log(response.data);
      const newUser = response.data;

      //checking if we got any response or not
      if (!newUser) {
        setError("Couldn't register a user.Please try again!!");
        await Swal.fire({
          title: "Regostration Failed!!",
          text: "Couldn't register a user.Please try again!!",
          icon: "Error",
        });
      }

      await Swal.fire({
        title: "Registration Successfull!",
        text: newUser,
        icon: "success",
      });

      //navigating to login page
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  // useEffect(() => {
  //   console.log(userData);
  // }, [userData]);
  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register_form" onSubmit={registerUser}>
          {error && <p className="form_error-msg">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password2"
            placeholder="Confirm password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          Already have an account? <Link to="/login">Sign In</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
