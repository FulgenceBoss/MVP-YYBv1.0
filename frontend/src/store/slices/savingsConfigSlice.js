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

const savingsConfigSlice = createSlice({
  name: "savingsConfig",
  initialState: {
    config: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    amount: 1000, // Valeur par défaut
    deductionTime: "20:00",
    wallet: "",
    operator: "Moov",
  },
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setDeductionTime: (state, action) => {
      state.deductionTime = action.payload;
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
        state.error = action.payload.message;
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
        state.error = action.payload.message;
      });
  },
});

export const {
  resetConfig,
  setAmount,
  setDeductionTime,
  setWallet,
  setOperator,
} = savingsConfigSlice.actions;

export default savingsConfigSlice.reducer;
