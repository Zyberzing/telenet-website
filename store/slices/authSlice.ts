import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null; // access token
  refreshToken: string | null; // refresh token
  user: any | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  refreshToken:
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, refreshToken, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = user;

      if (typeof window !== "undefined") {
        try {
          if (token !== undefined && token !== null) {
            localStorage.setItem("token", token);
          }
          if (refreshToken !== undefined && refreshToken !== null) {
            localStorage.setItem("refreshToken", refreshToken);
          }
          if (user !== undefined && user !== null) {
            localStorage.setItem("user", JSON.stringify(user));
          }
        } catch (err) {
          console.warn("[authSlice] Failed to persist auth to localStorage:", err);
        }
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        try {
          if (action.payload !== undefined && action.payload !== null) {
            localStorage.setItem("user", JSON.stringify(action.payload));
          } else {
            localStorage.removeItem("user");
          }
        } catch (err) {
          console.warn("[authSlice] Failed to persist user to localStorage:", err);
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
