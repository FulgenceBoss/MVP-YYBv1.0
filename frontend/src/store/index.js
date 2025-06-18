import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import savingsConfigReducer from "./slices/savingsConfigSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    savingsConfig: savingsConfigReducer,
    // ... other reducers can be added here
  },
});
