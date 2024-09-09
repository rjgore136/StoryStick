import React, { useContext } from "react";
import { UserContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const naviagate = useNavigate();

  setCurrentUser(null);
  naviagate("/login");
  return <></>;
};

export default Logout;
