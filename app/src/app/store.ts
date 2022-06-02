import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ethersReducer from "../store/ethersReducer";
import snackbarReducer from "../store/snackbarReducer";
import contractReducer from "../store/contractReducer";

export const store = configureStore({
  reducer: {
    ethers: ethersReducer,
    snackbar: snackbarReducer,
    contract: contractReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
