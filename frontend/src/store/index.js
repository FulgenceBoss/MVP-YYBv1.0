import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import savingsConfigReducer from "./slices/savingsConfigSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    savingsConfig: savingsConfigReducer,
    user: userReducer,
    // ... other reducers can be added here
  },
  // Adding middleware to disable serializableCheck for now
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
