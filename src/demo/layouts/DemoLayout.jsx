// src/demo/layouts/DemoLayout.jsx
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { DemoProvider } from "../DemoContext";
import { DemoStoryProvider } from "../context/DemoStoryContext";
import DemoStoryOverlay from "../components/DemoStoryOverlay";
import DemoSidebar from "../components/DemoSidebar";
import DemoHeader from "../components/DemoHeader";
import DemoWalkthrough from "@/components/demo/DemoWalkthrough";

export default function DemoLayout() {
    const location = useLocation();

    return (
        <DemoProvider>
            <DemoStoryProvider>
                <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
                    <DemoSidebar />

                    {/* STORY OVERLAY (Bureau Only) */}
                    {!location.pathname.includes('/demo/company') && <DemoStoryOverlay />}

                    <div className="flex-1 ml-64 flex flex-col min-w-0">
                        <DemoHeader />

                        <main className="flex-1 p-6 overflow-y-auto">
                            <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
                                <Outlet />
                            </div>
                        </main>
                    </div>

                    {/* NEW DEMO WALKTHROUGH (Bureau Only) */}
                    {!location.pathname.includes('/demo/company') && <DemoWalkthrough />}
                </div>
            </DemoStoryProvider>
        </DemoProvider>
    );
}
