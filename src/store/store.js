import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import flowReducer from "./slices/flowSlice";
import appsReducer from "./slices/appSlice";
import shellReducer from "./slices/shellSlice";
import accountReducer from "./slices/accountSlice";
import dashflowReducer from "./slices/dashflowSlice";
import histroyReducer from "./slices/historySlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    canvas: flowReducer,
    shell: shellReducer,
    apps: appsReducer,
    account: accountReducer,
    dashflow: dashflowReducer,
    history: histroyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
