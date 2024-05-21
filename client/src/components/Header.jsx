import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "./useLocalStorage";

export function Header() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(function () {
    let userObj = localStorage.getItem("userInfo");
    if (userObj) {
      console.log(userObj);
      let userJson = JSON.parse(userObj);
      console.log(userJson);
      setUserInfo(userJson);
    }
  }, []);

  // useEffect(() => {
  //   function listenForStorage() {
  //     const item = localStorage.getItem("userInfo");
  //     console.log("Reached effect");
  //     if (item) {
  //       console.log(item);
  //       setUserInfo(JSON.parse(item));
  //     }
  //   }

  //   window.addEventListener("localStorageChange", listenForStorage);
  //   return () => {
  //     window.removeEventListener("localStorageChange", listenForStorage);
  //   };
  // }, []);

  async function handleLogout() {
    let res = await fetch("http://localhost:3000/api/logout", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ a: 1, b: 2 }),
      credentials: "include",
    });
    if (res.status === 200) {
      localStorage.removeItem("userInfo");
      let result = await res.json();
      console.log(result);
      setUserInfo({});
    } else {
      console.log("logout failed");
    }
  }

  return (
    <header>
      <nav
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: "1rem",
        }}
      >
        <Link to="/"> Home </Link>
        <Link to="/contact"> Contact </Link>
        <Link to="/about"> About </Link>
        <Link to="/login"> Login </Link>
        <Link to="/register"> Register </Link>
        {userInfo.username && <span> Logged in as {userInfo.email}</span>}
        {userInfo.username && <span onClick={handleLogout}> Logout </span>}
      </nav>
    </header>
  );
}
