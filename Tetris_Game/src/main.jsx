import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap; // ✅ Attach it manually

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
