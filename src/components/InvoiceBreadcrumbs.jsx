// src/components/InvoiceBreadcrumbs.jsx
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { getValiflowId } from "@/lib/invoiceUtils.js";

export default function InvoiceBreadcrumbs({ invoice }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();

  const isList = pathname === "/dashboard/invoices";
  const isDetail = /^\/dashboard\/invoices\/[^/]+$/.test(pathname);
  const isAudit = pathname.endsWith("/audit");

  const valiflowId = invoice ? getValiflowId(invoice) : id;

  return (
    <div className="flex items-center gap-1 text-sm text-slate-600 mb-4">
      
      {/* HOME (always) */}
      <button
        onClick={() => navigate("/dashboard")}
        className="hover:text-blue-600 transition flex items-center gap-1"
      >
        <HomeIcon className="w-4 h-4" />
      </button>

      <ChevronRightIcon className="w-4 h-4 opacity-40" />

      {/* Fakturalista */}
      <button
        onClick={() => navigate("/dashboard/invoices")}
        className={`transition ${
          isList ? "text-blue-700 font-semibold" : "hover:text-blue-600"
        }`}
      >
        Fakturor
      </button>

      {isDetail || isAudit ? (
        <>
          <ChevronRightIcon className="w-4 h-4 opacity-40" />
          <span
            className={`transition ${
              isDetail && !isAudit
                ? "text-blue-700 font-semibold"
                : "hover:text-blue-600 cursor-pointer"
            }`}
            onClick={() => navigate(`/dashboard/invoices/${id}`)}
          >
            {valiflowId}
          </span>
        </>
      ) : null}

      {isAudit && (
        <>
          <ChevronRightIcon className="w-4 h-4 opacity-40" />
          <span className="text-blue-700 font-semibold">Audit-logg</span>
        </>
      )}
    </div>
  );
}
