// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext.jsx";
import InvoiceSSEProvider from "./realtime/InvoiceSSEProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InvoiceSSEProvider>
        <App />
        <Toaster position="top-right" richColors />
      </InvoiceSSEProvider>
    </AuthProvider>
  </BrowserRouter>
);
