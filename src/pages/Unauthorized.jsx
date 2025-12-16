// src/pages/Unauthorized.jsx
import React from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-6 text-center">
      <div className="bg-white border rounded-2xl shadow-sm p-10 max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <LockClosedIcon className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-slate-800 mb-3">
          Åtkomst nekad
        </h1>
        <p className="text-slate-600 mb-6">
          Du har inte behörighet att visa denna sida. <br />
          Kontakta din systemadministratör om du tror detta är ett misstag.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Till startsidan
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-100 transition"
          >
            Logga in
          </Link>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} Valiflow AB • Alla rättigheter reserverade
      </p>
    </div>
  );
}
