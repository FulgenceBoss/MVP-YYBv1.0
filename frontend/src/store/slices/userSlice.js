import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/api";
import * as SecureStore from "expo-secure-store";
import { updateAuthUser } from "./authSlice";

// Thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    console.log("[DEBUG] 2. userSlice: Entrée dans fetchUserProfile.");
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        console.log("[DEBUG] 2a. userSlice: ECHEC - Pas de token trouvé.");
        return rejectWithValue("No token found");
      }
      console.log(
        "[DEBUG] 2b. userSlice: Token trouvé. Lancement de l'appel API vers /auth/me."
      );
      const response = await apiClient.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(
        "[DEBUG] 2c. userSlice: SUCCES - Réponse API reçue.",
        response.data
      );
      return response.data.user;
    } catch (error) {
      console.log(
        "[DEBUG] 2d. userSlice: ERREUR CATCH - L'appel API a échoué.",
        error
      );
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
  async (imageUri, { rejectWithValue, dispatch }) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const formData = new FormData();
      const fileType = imageUri.split(".").pop();

      formData.append("avatar", {
        uri: imageUri,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      });

      const response = await apiClient.put("/users/me/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

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
        console.log(
          "[DEBUG] 3. userSlice: Reducer 'pending' exécuté. status -> loading."
        );
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
      });
  },
});

export default userSlice.reducer;
