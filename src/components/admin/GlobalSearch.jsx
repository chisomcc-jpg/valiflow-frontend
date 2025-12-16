
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';

// Simple Cmd+K Search Modal
export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        }
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            // Mocking search for now or calling api/search
            // Since we didn't add /search to adminRoutes yet, let's use client search shim or just mock
            // In real Phase C, we add GET /admin/search
            // For now, let's just show static results to demonstrate UI or call getClients if appropriate
            try {
                const res = await adminService.getClients(1, 5, query);
                setResults(res.items.map(c => ({ type: 'Company', label: c.name, id: c.id, path: `/admin/clients/${c.id}` })));
            } catch (e) { }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-center px-4 border-b">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    <input
                        autoFocus
                        className="w-full px-4 py-4 text-lg outline-none"
                        placeholder="Sök företag, användare, fakturor..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button onClick={() => setIsOpen(false)} className="text-xs border px-2 py-1 rounded bg-gray-50 text-gray-500">ESC</button>
                </div>
                {results.length > 0 && (
                    <ul className="max-h-96 overflow-y-auto py-2">
                        {results.map((res, i) => (
                            <li key={i}>
                                <button
                                    onClick={() => {
                                        navigate(res.path);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-emerald-50 flex items-center justify-between group"
                                >
                                    <div>
                                        <span className="block font-medium text-slate-800">{res.label}</span>
                                        <span className="text-xs text-slate-500 uppercase">{res.type}</span>
                                    </div>
                                    <span className="text-emerald-600 opacity-0 group-hover:opacity-100">↵</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {query && results.length === 0 && (
                    <div className="p-4 text-center text-gray-500">Inga träffar...</div>
                )}
                {!query && (
                    <div className="p-4 text-center text-xs text-gray-400">
                        Sök efter kunder, användare eller incidenter.
                    </div>
                )}
            </div>
        </div>
    );
}
