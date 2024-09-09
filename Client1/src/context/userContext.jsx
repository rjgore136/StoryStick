import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  //currentUser state will be updated every time new use logs in
  //we used JSON.parse() as whatever data that will be present in local storage , it will be in json string
  //JSON.parse() converts json string into js object
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  useEffect(() => {
    //localstorage will store the user data
    //we used JSON.stringify() as localstorage only stores in string format,and this method converts js object into json string
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const contextValue = {
    currentUser,
    setCurrentUser,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
