import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Thunk to fetch savings configuration
export const fetchSavingsConfig = createAsyncThunk(
  "savingsConfig/fetchConfig",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/savings/config");
      return response.data.config;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update savings configuration
export const updateSavingsConfig = createAsyncThunk(
  "savingsConfig/updateConfig",
  async (configData, { rejectWithValue }) => {
    try {
      const response = await api.post("/savings/config", configData);
      return response.data.config;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to test mobile money connection
export const testConnection = createAsyncThunk(
  "savingsConfig/testConnection",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/savings/test-connection");
      return response.data; // Contient { success: true, message: "..." }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const savingsConfigSlice = createSlice({
  name: "savingsConfig",
  initialState: {
    config: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    goal: null, // To store the selected goal object
    amount: 1000, // Valeur par défaut
    deductionTime: 20, // Always a number (hour of the day)
    wallet: "",
    operator: "Moov",
  },
  reducers: {
    setGoal: (state, action) => {
      state.goal = action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setDeductionTime: (state, action) => {
      state.deductionTime = Number(action.payload); // Ensure it's always a number
    },
    setWallet: (state, action) => {
      state.wallet = action.payload;
    },
    setOperator: (state, action) => {
      state.operator = action.payload;
    },
    resetConfig: (state) => {
      state.config = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch config
      .addCase(fetchSavingsConfig.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSavingsConfig.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.config = action.payload;
      })
      .addCase(fetchSavingsConfig.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message ||
          "Impossible de charger la configuration d'épargne.";
      })
      // Update config
      .addCase(updateSavingsConfig.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSavingsConfig.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.config = action.payload;
      })
      .addCase(updateSavingsConfig.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message ||
          "Impossible de mettre à jour la configuration d'épargne.";
      })
      // Test Connection
      .addCase(testConnection.pending, (state) => {
        // Optionnel: on pourrait avoir un état 'testing'
      })
      .addCase(testConnection.fulfilled, (state, action) => {
        // Pas besoin de changer l'état ici, on gère le message via l'alerte
      })
      .addCase(testConnection.rejected, (state, action) => {
        // Idem, l'erreur est gérée dans l'alerte
      });
  },
});

export const {
  resetConfig,
  setGoal,
  setAmount,
  setDeductionTime,
  setWallet,
  setOperator,
} = savingsConfigSlice.actions;

export default savingsConfigSlice.reducer;
