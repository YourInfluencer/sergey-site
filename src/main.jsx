import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import "./styles/Base.css";
import "./styles/Layout.css";
import "./styles/Header.css";
import "./styles/Footer.css";
import "./styles/Home.css";
import "./styles/Services.css";
import "./styles/Prices.css";
import "./styles/Modal.css";
import "./styles/Toast.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);