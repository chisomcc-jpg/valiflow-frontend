import { createContext, useContext, useState } from "react";
import useInvoiceSSE from "./useInvoiceSSE.jsx";
import { useLocation } from "react-router-dom";

const InvoiceSSEContext = createContext(null);

function InvoiceSSEProvider({ children }) {
  const { pathname } = useLocation();

  // Endast aktivt på fakturasidor
  const active = pathname.startsWith("/dashboard/invoices");

  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);

  // Kör SSE hook – StrictMode & Vite-safe
  useInvoiceSSE(setInvoices, setSelected, active);

  return (
    <InvoiceSSEContext.Provider
      value={{
        invoices,
        setInvoices,
        selected,
        setSelected,
      }}
    >
      {children}
    </InvoiceSSEContext.Provider>
  );
}

// Hook som används av resten av appen
export function useInvoiceData() {
  return useContext(InvoiceSSEContext);
}

// 👇 Viktigt för Vite / Fast Refresh
export default InvoiceSSEProvider;
