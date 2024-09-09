import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import Authors from "./pages/Authors";
import AuthorPosts from "./pages/AuthorPosts";
import CategoryPosts from "./pages/CategoryPosts";
import CreatePost from "./pages/CreatePost";
import DashBoard from "./pages/DashBoard";
import Logout from "./pages/Logout";
import EditPost from "./pages/EditPost";
import DeletePost from "./pages/DeletePost";
import UserContextProvider from "./context/userContext";

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserContextProvider>
        <Layout />
      </UserContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts/:id", element: <PostDetails /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "authors", element: <Authors /> },
      { path: "create", element: <CreatePost /> },
      { path: "posts/categories/:category", element: <CategoryPosts /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "myposts/:id", element: <DashBoard /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "logout", element: <Logout /> },
      { path: "posts/:id/delete", element: <DeletePost /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
