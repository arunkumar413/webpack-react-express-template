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
import { API_URL } from "../constants";

export function Home() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);

  function handleIncrement() {
    dispatch(increment());
  }

  function handleDecrement() {
    dispatch(decrement());
  }

  useEffect(function () {
    async function getData() {
      try {
        let res = await fetch(`${API_URL}/mytasks`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
          credentials: "include",
        });
        if (res.status === 200) {
          let data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.warn("Unable to load tasks", err);
      }
    }
    getData();
  }, []);

  const taskElements = tasks.map(function (item, index) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          gap: "1rem",
        }}
        key={index.toString()}
      >
        <span style={{ padding: "0.5rem" }}> {item.title}</span>
        <span> {item.status}</span>
      </div>
    );
  });

  const taskHeadingElements = ["Title", "Status"].map(function (item, index) {
    return <h5 key={item}> {item}</h5>;
  });

  return (
    <RecoilRoot>
      <Header />
      <div className="app-component px-4 py-6">
        <h2>Features:</h2>
        <ul>
          <li>Webpack </li>
          <li>React</li>
          <li> React router</li>
          <li> Redux toolkit </li>
          <li> Expressjs</li>
          <li> Server side</li>
          <li> session</li>
          <li> RBAC</li>
          <li> MongoDB</li>
          <li> Multiple Tenant organization</li>
          <li> Departments</li>
          <li> Roles</li>
          <li> Permission</li>
        </ul>


      </div>
    </RecoilRoot>
  );
}
