import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { MoralisProvider } from "react-moralis";
import config from "./config.json";

const container = document.getElementById("root")!;

ReactDOM.render(
  <MoralisProvider
    appId={config.moralisAppId}
    serverUrl={config.moralisServerUrl}
  >
    <Provider store={store}>
      <SnackbarProvider maxSnack={1}>
        <App />
      </SnackbarProvider>
    </Provider>
  </MoralisProvider>,
  container
);
