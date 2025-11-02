import { authApi } from "@/services/authApi";
import { faqApi } from "@/services/cms-content/faqApi";
import { plansApi } from "@/services/plansApi";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [plansApi.reducerPath]: plansApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      plansApi.middleware,
      faqApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
