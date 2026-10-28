import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setApiResponse: (state, action) => {
      const { key, statusCode, data = null, error = null } = action.payload;
      state[key] = { statusCode, data, error };
    },
    clearApiResponse: (state, action) => {
      delete state[action.payload];
    },
    clearApiResponses: () => initialState,
  },
});

export const { setApiResponse, clearApiResponse, clearApiResponses } =
  apiSlice.actions;

export const selectApiResponse = (state, key) =>
  state.api[key] || { statusCode: null, data: null, error: null };

export default apiSlice.reducer;
