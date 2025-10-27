import App from "@/App";
import RootProvider from "@/providers/RootProvider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RootProvider>
        <App />
      </RootProvider>
    </BrowserRouter>
  </StrictMode>,
);
