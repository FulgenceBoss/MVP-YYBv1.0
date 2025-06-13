import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import savingsConfigReducer from "./slices/savingsConfigSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    savingsConfig: savingsConfigReducer,
    dashboard: dashboardReducer,
    // ... other reducers can be added here
  },
});
