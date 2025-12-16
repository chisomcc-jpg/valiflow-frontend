import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

/**
 * PublicLayout
 * Wraps all public-facing pages (Home, Product, Pricing, etc.)
 * Includes the global Navbar and handles page spacing.
 */
export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white">
      {/* Navbar visible on all public pages */}
      <Navbar />

      {/* Content of the active page */}
      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
}
