import { createSlice } from "@reduxjs/toolkit";

const emptyAuth = {
  username: "",
  email: "",
  roles: [],
  permissions: [],
  isLoggedin: false,
};

function readStoredAuth() {
  if (typeof localStorage === "undefined") {
    return emptyAuth;
  }

  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) {
      return emptyAuth;
    }

    const user = JSON.parse(raw);
    if (!user?.username && !user?.email) {
      return emptyAuth;
    }

    return {
      username: user.username || "",
      email: user.email || "",
      roles: user.roles || [],
      permissions: user.permissions || [],
      isLoggedin: true,
    };
  } catch {
    return emptyAuth;
  }
}

export const authSlice = createSlice({
  name: "auth",
  initialState: readStoredAuth(),
  reducers: {
    setUserInfo: (state, action) => {
      state.username = action.payload.username || "";
      state.email = action.payload.email || "";
      state.roles = action.payload.roles || [];
      state.permissions = action.payload.permissions || [];
      state.isLoggedin = true;
    },
    logout: function (state) {
      state.username = "";
      state.email = "";
      state.roles = [];
      state.permissions = [];
      state.isLoggedin = false;
    },
  },
});

export const { setUserInfo, logout } = authSlice.actions;

export default authSlice.reducer;
