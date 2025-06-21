import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import { resetConfig } from "./savingsConfigSlice";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phoneNumber, pin }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { phoneNumber, pin });
      const { token, user } = response.data;
      await AsyncStorage.setItem("userToken", token);
      dispatch(resetConfig());
      return { token, user };
    } catch (err) {
      // Log the full error for debugging
      console.error("Login Error:", JSON.stringify(err, null, 2));
      const message =
        err.response?.data?.message || "Une erreur de connexion est survenue.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  userToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.userToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.user = null;
      AsyncStorage.removeItem("userToken");
      // On ne peut pas dispatcher ici, mais on va le faire dans le composant qui appelle logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userToken = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.userToken = null;
        state.user = null;
      });
  },
});

export const { logout, setLoading, setError, setUserToken } = authSlice.actions;

export default authSlice.reducer;
