// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* stays visible on every page */}
      <main className="flex-grow">
        <Outlet /> {/* renders page content here */}
      </main>
      <Footer />
    </div>
  );
}
