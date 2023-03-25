import React, { useState } from "react";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

export function App() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    setCount(function (prevState) {
      return prevState + 1;
    });
  }

  return (
    <RecoilRoot>
      <div>
        <h1>Hello Webpack+React+Express</h1>
        <h4>count: {count}</h4>
        <button onClick={handleIncrement}>increment</button>
      </div>
    </RecoilRoot>
  );
}
