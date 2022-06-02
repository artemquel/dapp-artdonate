import { BrowserRouter, Routes } from "react-router-dom";
import { PropsWithChildren } from "react";

type Props = {
  connected: boolean;
  landingPage: JSX.Element;
};

export const AppRoutes = (props: PropsWithChildren<Props>): JSX.Element => {
  const { connected, landingPage, children } = props;
  if (!connected) {
    return landingPage;
  }
  return (
    <BrowserRouter>
      <Routes>{children}</Routes>
    </BrowserRouter>
  );
};
