import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import authReducer from "./authSlice";
import apiReducer from "./apiSlice";

export const appStore = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    api: apiReducer,
  },
});
