import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { FrontPage } from "./pages/frontPage";
import { AddNewArticle } from "./pages/addNewArticle";
import React, { useContext } from "react";
import "./application.css";
import { LoginPage } from "./pages/loginPage";
import { useLoading } from "./useLoading";
import { ArticlesApiContext } from "./articlesApiContext";
import { Profile } from "./pages/profile";

function UserActions({ user }) {
  if (!user || Object.keys(user).length === 0) {
    return <Link to={"/login"}>Login</Link>;
  }

  return (
    <>
      <Link to={"/profile"}>
        {user.google?.name
          ? `Profile for ${user.google.name}`
          : user.openid?.name
          ? `Profile for ${user.openid.name}`
          : "Profile"}
      </Link>
      <Link to={"/login/endsession"}>Log out</Link>
    </>
  );
}

export function Application() {
  const { fetchLogin } = useContext(ArticlesApiContext);
  const { data, error, loading, reload } = useLoading(fetchLogin);

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }
  if (loading) {
    return <div>Please wait...</div>;
  }

  function getCookie(key) {
    let cookie = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return cookie ? cookie.pop() : undefined;
  }

  function isAuthed() {
    let google = getCookie("google_access_token");
    let openid = getCookie("openid_access_token");

    return {
      auth: google
        ? { google: true, openid: false }
        : openid
        ? { google: false, openid: true }
        : {
            google: false,
            openid: false,
          },
    };
  }

  function PrivateRoute({ children }) {
    return isAuthed().auth.google ? (
      children
    ) : isAuthed().auth.openid ? (
      children
    ) : (
      <Navigate to="/login" />
    );
  }

  return (
    <div className={"parent"}>
      <BrowserRouter>
        <header>
          <Link to={"/"}>Front page</Link>
          {isAuthed().auth.openid ? (
            <Link to={"/article/new"}>Add articles</Link>
          ) : (
            ""
          )}

          <div className="menu-divider" />
          <UserActions user={data?.user} />
        </header>
        <Routes>
          <Route path="/" element={<FrontPage user={data.user} />} />
          <Route
            path={"/article/new"}
            element={
              <PrivateRoute>
                <AddNewArticle user={data.user} />
              </PrivateRoute>
            }
          />
          <Route
            path={"/login/*"}
            element={<LoginPage config={data.config} reload={reload} />}
          />
          <Route
            path={"/profile"}
            element={
              <PrivateRoute>
                <Profile user={data?.user} />
              </PrivateRoute>
            }
          />
          <Route path={"*"} element={<h1>Not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
