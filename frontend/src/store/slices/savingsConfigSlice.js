import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Thunk pour récupérer la config
export const fetchSavingsConfig = createAsyncThunk(
  "savingsConfig/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/savings/config");
      return res.data.config;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Erreur serveur"
      );
    }
  }
);

// Thunk pour sauvegarder la config
export const saveSavingsConfig = createAsyncThunk(
  "savingsConfig/save",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/savings/config", payload);
      return res.data.config;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Erreur serveur"
      );
    }
  }
);

const savingsConfigSlice = createSlice({
  name: "savingsConfig",
  initialState: {
    amount: 1000,
    deductionTime: "",
    wallet: "",
    active: true,
    config: null,
    configExists: null,
    status: "idle",
    error: null,
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
    setActive: (state, action) => {
      state.active = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavingsConfig.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSavingsConfig.fulfilled, (state, action) => {
        state.status = "success";
        if (action.payload) {
          state.config = action.payload;
          state.amount = action.payload.amount;
          state.deductionTime = action.payload.deductionTime;
          state.wallet = action.payload.wallet;
          state.operator = action.payload.operator;
          state.active = action.payload.active;
          state.configExists = true;
        } else {
          state.configExists = false;
        }
      })
      .addCase(fetchSavingsConfig.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
        state.configExists = false;
      })
      .addCase(saveSavingsConfig.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveSavingsConfig.fulfilled, (state, action) => {
        state.status = "success";
        state.config = action.payload;
      })
      .addCase(saveSavingsConfig.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export const {
  setAmount,
  setDeductionTime,
  setWallet,
  setActive,
  setOperator,
} = savingsConfigSlice.actions;
export default savingsConfigSlice.reducer;
