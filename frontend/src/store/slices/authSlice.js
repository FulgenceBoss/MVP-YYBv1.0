import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import api from "../../api/api";
import { resetConfig } from "./savingsConfigSlice";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phoneNumber, pin }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { phoneNumber, pin });
      const { token, user } = response.data;
      await SecureStore.setItemAsync("userToken", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(resetConfig());
      return { token, user };
    } catch (err) {
      let errorMessage = "Une erreur de connexion est survenue.";
      if (err.response?.status === 429) {
        errorMessage =
          "Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "Erreur de réseau. Vérifiez votre connexion internet.";
      }
      console.error("Login Error:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const rehydrateAuth = createAsyncThunk(
  "auth/rehydrate",
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        return rejectWithValue("No token found");
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await api.get("/auth/me");
      return { token, user: response.data.user };
    } catch (error) {
      SecureStore.deleteItemAsync("userToken"); // Token is invalid, remove it
      const message =
        error?.response?.data?.message || "Session invalide ou expirée.";
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
    logoutSuccess: (state) => {
      state.userToken = null;
      state.user = null;
      state.isLoading = false;
      state.error = null;
      SecureStore.deleteItemAsync("userToken");
      delete api.defaults.headers.common["Authorization"];
    },
    updateAuthUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload;
      }
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
      })
      .addCase(rehydrateAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rehydrateAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userToken = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(rehydrateAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userToken = null;
        state.user = null;
        state.error = action.payload; // Store the error message
      });
  },
});

export const {
  setUserToken,
  setLoading,
  setError,
  logoutSuccess,
  updateAuthUser,
} = authSlice.actions;

export const logout = () => (dispatch) => {
  dispatch(logoutSuccess());
  dispatch(resetConfig()); // Reset savings config on logout
};

export default authSlice.reducer;
