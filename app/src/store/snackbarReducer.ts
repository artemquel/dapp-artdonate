import { createSlice } from "@reduxjs/toolkit";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

const name = "snackbar";

type EnqueueSnackbarFn = (
  message: SnackbarMessage,
  options?: OptionsObject
) => SnackbarKey;

interface SnackbarState {
  enqueueSnackbar: EnqueueSnackbarFn | null;
}

const initialState: SnackbarState = {
  enqueueSnackbar: null,
};

const snackbarSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSnackbarCb: (state, { payload }: { payload: EnqueueSnackbarFn }) => {
      state.enqueueSnackbar = payload;
    },
    enqueueSnackbar: (
      state,
      {
        payload: { message, options },
      }: { payload: { message: SnackbarMessage; options?: OptionsObject } }
    ) => {
      if (state.enqueueSnackbar) {
        state.enqueueSnackbar(message, options);
      }
    },
  },
});

export const { setSnackbarCb, enqueueSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
