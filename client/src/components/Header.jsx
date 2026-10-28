import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUserInfo } from "../store/authSlice";
import { ThemeSelect } from "./ThemeSelect";
import { API_URL } from "../constants";
import { apiRequest } from "../store/apiClient";

export function Header() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(function () {
    let userObj = localStorage.getItem("userInfo");
    if (userObj) {
      let userJson = JSON.parse(userObj);
        dispatch(
          setUserInfo({
            username: userJson.username,
            email: userJson.email,
            roles: userJson.roles,
            permissions: userJson.permissions,
            isLoggedIn: true,
          })
        );
    }
  }, [dispatch]);

  async function handleLogout() {
    let result = await apiRequest(dispatch, "logout", `${API_URL}/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });
    if (result.response.ok) {
      localStorage.removeItem("userInfo");
      dispatch(logout());
    } else {
      console.log("logout failed");
    }
  }

  return (
    <header className="border-b border-slate-200 bg-surface">
      <nav className="mx-auto flex max-w-6xl flex-row flex-wrap items-center justify-start gap-4 px-4 py-4">
        <Link className="text-slate-700 hover:text-slate-900" to="/">
          Home
        </Link>
        {auth.username && (
          <Link className="text-slate-700 hover:text-slate-900" to="/profile">
            Profile
          </Link>
        )}
        <Link className="text-slate-700 hover:text-slate-900" to="/contact">
          Contact
        </Link>
        <Link className="text-slate-700 hover:text-slate-900" to="/about">
          About
        </Link>
        {!auth.username && (
          <Link className="text-slate-700 hover:text-slate-900" to="/login">
            Login
          </Link>
        )}
        {!auth.username && (
          <Link className="text-slate-700 hover:text-slate-900" to="/register">
            Register
          </Link>
        )}
        {auth.username && (
          <span className="text-sm text-slate-500">Logged in as {auth.email}</span>
        )}
        {auth.username && (
          <button
            className="rounded bg-primary px-3 py-1 text-sm text-white hover:bg-primary-hover"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
        <ThemeSelect />
      </nav>
    </header>
  );
}
