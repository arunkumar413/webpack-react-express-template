import React, { useEffect, useState } from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import "../app.css";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "../store/counterSlice";

export function Home() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  function handleIncrement() {
    dispatch(increment());
  }

  function handleDecrement() {
    dispatch(decrement());
  }

  useEffect(function () {
    async function getData() {
      let res = await fetch("http://localhost:3000/api", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ a: 1, b: 2 }),
        credentials: "include",
      });
      let data = await res.json();
      console.log(data);
    }
    getData();
  }, []);

  return (
    <RecoilRoot>
      <Header />
      <div className="app-component">
        <h1>
          Hello Webpack+React+React router+Redux toolkit + Express + Server side
          session
        </h1>
        <h4>count: {count}</h4>
        <button onClick={handleIncrement}>increment</button>
        <button onClick={handleDecrement}>decrement</button>
      </div>
    </RecoilRoot>
  );
}
