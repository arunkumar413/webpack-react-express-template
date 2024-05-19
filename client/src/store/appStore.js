import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

export const appStore = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
