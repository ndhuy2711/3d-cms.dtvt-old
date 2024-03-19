import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { AppProvider } from "./Context";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import App from "./App";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";

ReactDOM.render(
  <ChakraProvider>
    <ThemeEditorProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeEditorProvider>
  </ChakraProvider>,
  document.getElementById("root")
);
