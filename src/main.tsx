import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/routing.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemen #root tidak ditemukan di index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
