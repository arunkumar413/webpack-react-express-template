import React from "react";
import { Link } from "react-router-dom";

export function Header() {
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
      </nav>
    </header>
  );
}
