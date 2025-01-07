import React, { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppWrapper } from "./components/styled";
import { Button, ChakraProvider, Wrap } from "@chakra-ui/react";
import { theme } from "./theme";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RenderRoutes } from "./routes";

const App = () => {
  const router = createBrowserRouter([{ path: "*", Component: RenderRoutes }]);

  return (
    <AppWrapper>
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ChakraProvider>
    </AppWrapper>
  );
};

export default App;
