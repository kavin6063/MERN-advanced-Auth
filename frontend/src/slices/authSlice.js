import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice"; // apiSlice needs to be imported properly

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isCheckingAuth: false,
    message: null,
    resetPasswordSuccess: false,
  },
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setCheckingAuth: (state, action) => {
      state.isCheckingAuth = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
      state.isLoading = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    logoutUser: (state) => {
      console.log("Logging out user");
      state.user = null;
      state.isAuthenticated = false;
    },
    resetPasswordSuccess: (state, action) => {
      state.resetPasswordSuccess = action.payload; // Set reset password success state
    },
  },
});

export const {
  setLoading,
  setUser,
  setError,
  setAuthenticated,
  setCheckingAuth,
  setMessage,
  resetError,
  logoutUser,
  resetPasswordSuccess,
} = authSlice.actions;

export default authSlice.reducer;
