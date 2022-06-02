import React, { useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRoutes } from "./components";
import { useAppDispatch } from "./app/hooks";
import { Exchange, Landing, Mint, AllItems, MyItems } from "./pages";
import theme from "./theme";
import { Navigate, Route } from "react-router-dom";
import { routes } from "./constants";
import { useSnackbar } from "notistack";
import { setSnackbarCb } from "./store/snackbarReducer";
import { connect } from "./store/ethersReducer";
import { useContractListener } from "./hooks";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";

function App() {
  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();

  const isContractReady = useContractListener();

  const { enableWeb3, isAuthenticated, isWeb3Enabled, provider } = useMoralis();
  // Init web3
  useEffect(() => {
    enableWeb3();
  }, [dispatch, enableWeb3]);

  useEffect(() => {
    dispatch(connect(provider as Moralis.EthersExternalProvider));
  }, [provider, dispatch]);

  // Init snackbar
  useEffect(() => {
    dispatch(setSnackbarCb(snackbar.enqueueSnackbar));
  }, [snackbar, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes
        connected={isWeb3Enabled && isAuthenticated && isContractReady}
        landingPage={<Landing />}
      >
        <Route path={routes.exchange} element={<Exchange />} />
        <Route path={routes.mint} element={<Mint />} />
        <Route path={routes.allItems} element={<AllItems />} />
        <Route path={routes.myItems} element={<MyItems />} />
        <Route path="*" element={<Navigate to={routes.myItems} replace />} />
      </AppRoutes>
    </ThemeProvider>
  );
}

export default App;
