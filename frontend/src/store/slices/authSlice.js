import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: null, // or get from storage
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.userToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setLoading, setUserToken, setError, logout } = authSlice.actions;

export default authSlice.reducer;
