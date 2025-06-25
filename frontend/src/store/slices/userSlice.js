import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/api";
import * as SecureStore from "expo-secure-store";
import { updateAuthUser, logout } from "./authSlice";

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

// Thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ fullName }, { rejectWithValue, dispatch }) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        return rejectWithValue("No token found");
      }
      const response = await apiClient.put(
        "/users/me",
        { fullName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Dispatch to update the auth slice as well
      dispatch(updateAuthUser(response.data.user));
      return response.data.user;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Mise à jour du profil échouée.";
      return rejectWithValue(message);
    }
  }
);

// Thunk to upload user avatar
export const updateUserAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (imageAsset, { rejectWithValue, dispatch }) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const formData = new FormData();

      // Utiliser les informations de l'asset pour une construction robuste
      formData.append("avatar", {
        uri: imageAsset.uri,
        name: `avatar.${imageAsset.uri.split(".").pop()}`, // Garder un nom de fichier simple
        type: imageAsset.type
          ? `${imageAsset.type}/${imageAsset.uri.split(".").pop()}`
          : "image/jpeg", // Utiliser le vrai type MIME fourni par le picker
      });

      const response = await apiClient.put("/users/me/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Synchroniser également l'état d'authentification
      dispatch(updateAuthUser(response.data.user));
      return response.data.user;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Échec de la mise à jour de l'avatar.";
      return rejectWithValue(message);
    }
  }
);

// Thunk to change user PIN
export const changeUserPin = createAsyncThunk(
  "user/changePin",
  async ({ oldPin, newPin }, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        return rejectWithValue("No token found");
      }
      await apiClient.put(
        "/auth/change-pin",
        { oldPin, newPin },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return; // No data needed on success, just confirmation
    } catch (error) {
      const message =
        error?.response?.data?.message || "Échec du changement de PIN.";
      return rejectWithValue(message);
    }
  }
);

// Thunk to delete user account
export const deleteUserAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        return rejectWithValue("No token found");
      }
      await apiClient.delete("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // En cas de succès, déconnecter l'utilisateur
      dispatch(logout());
      return;
    } catch (error) {
      const message =
        error?.response?.data?.message || "La suppression du compte a échoué.";
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
  reducers: {
    clearUserError: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
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
      })
      // Cases for updating profile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Cases for changing PIN
      .addCase(changeUserPin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changeUserPin.fulfilled, (state) => {
        state.status = "succeeded";
        // No need to update userInfo here, but we could add a success message flag
      })
      .addCase(changeUserPin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Cases for updating avatar
      .addCase(updateUserAvatar.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Cases for deleting account
      .addCase(deleteUserAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.status = "succeeded";
        state.userInfo = null; // Vider les infos utilisateur
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;
