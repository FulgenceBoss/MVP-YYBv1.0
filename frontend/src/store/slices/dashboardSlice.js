import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/savings/balance");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "dashboard/fetchTransactions",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/savings/history");
      return response.data.transactions;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    balance: 0,
    status: "idle",
    error: null,
    transactions: [],
    transactionsStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    transactionsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance = action.payload.balance;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      // Cases for fetchTransactions
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsStatus = "loading";
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactionsStatus = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionsStatus = "failed";
        state.transactionsError = action.payload.message;
      });
  },
});

export default dashboardSlice.reducer;
