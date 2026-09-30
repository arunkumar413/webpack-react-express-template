import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUserInfo } from "../store/authSlice";
import { API_URL } from "../constants";

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
    let res = await fetch(`${API_URL}/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });
    if (res.status === 200) {
      localStorage.removeItem("userInfo");
      dispatch(logout());
    } else {
      console.log("logout failed");
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl flex-row flex-wrap items-center justify-start gap-4 px-4 py-3">
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
            className="rounded bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
