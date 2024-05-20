import React, { useState } from "react";
import { Header } from "../components/Header";

export function LoginPage() {
  const [userCred, setUserCred] = useState({
    email: "",
    password: "",
  });
  async function handleLogin() {
    let res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCred),
    });
    let result = await res.json();
    console.log(result);
  }

  function handleUserCred(evt) {
    setUserCred(function (prevState) {
      return { ...prevState, [evt.target.name]: evt.target.value };
    });
  }

  return (
    <div className="LoginPage">
      <Header />
      <h2> Login</h2>
      <label htmlFor="email">Email</label>
      <input onChange={handleUserCred} type="email" name="email" />
      <label htmlFor="password">Password</label>
      <input onChange={handleUserCred} type="password" name="password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
