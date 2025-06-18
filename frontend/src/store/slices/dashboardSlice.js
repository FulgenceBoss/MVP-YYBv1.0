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

export const saveManualTransaction = createAsyncThunk(
  "dashboard/saveManualTransaction",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await api.post("/savings/deposit", { amount });
      return response.data; // Devrait contenir la nouvelle transaction
    } catch (error) {
      // Gérer les erreurs où la réponse du serveur existe mais est une erreur (ex: 400, 500)
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      // Gérer les erreurs réseau (serveur éteint) ou autres erreurs inattendues
      return rejectWithValue({
        message:
          "Impossible de joindre le serveur. Veuillez vérifier votre connexion internet et réessayer.",
      });
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
    manualSaveStatus: "idle", // Pour suivre l'état de l'épargne manuelle
    manualSaveError: null,
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
      })
      .addCase(saveManualTransaction.pending, (state) => {
        state.manualSaveStatus = "loading";
        state.manualSaveError = null;
      })
      .addCase(saveManualTransaction.fulfilled, (state, action) => {
        state.manualSaveStatus = "succeeded";
        // Ajouter la nouvelle transaction à la liste et mettre à jour le solde
        state.transactions.unshift(action.payload.transaction);
        state.balance = action.payload.newBalance;
      })
      .addCase(saveManualTransaction.rejected, (state, action) => {
        state.manualSaveStatus = "failed";
        state.manualSaveError = action.payload.message;
      });
  },
});

export default dashboardSlice.reducer;
