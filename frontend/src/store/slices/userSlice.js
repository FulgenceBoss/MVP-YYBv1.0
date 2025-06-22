import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/config";
import * as SecureStore from "expo-secure-store";

// Thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        return rejectWithValue("No token found");
      }
      const response = await apiClient.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Impossible de charger le profil.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  userInfo: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
