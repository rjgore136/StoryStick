import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaEdit } from "react-icons/fa";
import axios from "axios";
import { UserContext } from "../context/userContext";
import Swal from "sweetalert2";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [error, setError] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  //access controll
  useEffect(() => {
    if (!currentUser.token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/${currentUser.id}`
        );
        // console.log(response.data);
        setName(response.data.message.name);
        setEmail(response.data.message.email);
        setAvatar(response.data.message.avatar);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const updateAvatar = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const postData = new FormData();
      postData.set("avatar", avatar);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/change-avatar`,
        postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      // console.log(response.data);
      setAvatar(response.data.updatedAvatar.avatar);
      setIsAvatarTouched(false);
      // navigate(0);
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  const updateDetails = async (e) => {
    e.preventDefault();
    try {
      // const updatedData = new FormData();
      // updatedData.set("name", name);
      // updatedData.set("email", email);
      // updatedData.set("currentpass", currentpass);
      // updatedData.set("newPass", newPass);
      // updatedData.set("confirmeNewPass", confirmeNewPass);

      const updatedData = {
        name,
        email,
        currentPass,
        newPass,
        confirmNewPass,
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/users/edit-user`,
        updatedData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );
      // console.log(response.data);
      if (response.data.success) {
        navigate("/login");
      }
    } catch (err) {
      // navigate(0);
      console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  return (
    <section>
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">
          My Posts
        </Link>
        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img
                src={`${import.meta.env.VITE_API_ASSETS_URL}/uploads/${avatar}`}
                alt="avatar"
              />
            </div>
            {/* form to update avatar  */}
            <form className="avatar_form" onSubmit={updateAvatar}>
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="png,jpg,jpeg"
              />
              <label
                htmlFor="avatar"
                onClick={() => {
                  setIsAvatarTouched(true);
                }}
              >
                <FaEdit />
              </label>
              {isAvatarTouched && (
                <button className="profile_avatar-btn">
                  <FaCheck />
                </button>
              )}
            </form>
          </div>
          <h1>{currentUser.name}</h1>

          {/* form to update user details */}
          <form className="form profile_form" onSubmit={updateDetails}>
            {error && <p className="form_error-msg">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPass}
              onChange={(e) => setConfirmNewPass(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
