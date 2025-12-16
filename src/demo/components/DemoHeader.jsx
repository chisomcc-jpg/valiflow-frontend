import React from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function DemoHeader() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
            {/* Search (Visual Only) */}
            <div className="relative w-96 hidden md:block">
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Sök i demo-miljö..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            <div className="flex items-center gap-4">
                {/* Banner */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-amber-700">Du kör Valiflow i demoläge</span>
                </div>

                <Button variant="ghost" size="icon" className="relative text-slate-500">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </Button>

                <div className="flex items-center gap-2">
                    {/* Restart Guide Button - Always visible */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            const newSearch = new URLSearchParams(location.search);
                            // Set demo=true to trigger the walkthrough effect
                            newSearch.set("demo", "true");
                            // If we are already in demo mode, forcing a navigation might be needed if params didn't change?
                            // But usually close() removes the param. So this is fine.
                            // If it's already open, this is a no-op which is fine.
                            navigate({ search: newSearch.toString() });
                        }}
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium mr-2"
                    >
                        Starta guide
                    </Button>

                    <Link to="/">
                        <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium">
                            Avsluta demo
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md font-medium">
                            Skapa riktigt konto
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
