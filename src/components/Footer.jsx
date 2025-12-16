import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#050C22] text-slate-400 py-12 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
                {/* BRAND */}
                <div className="space-y-4">
                    <Link to="/" className="flex items-center gap-2 text-white font-semibold">
                        <img src="/valiflow-logo.svg" alt="Valiflow" className="h-6 w-auto" />
                        <span className="tracking-wide">VALIFLOW</span>
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs text-slate-500">
                        Nordens finansiella Trust Layer.
                        <br />
                        Säkrar betalningar och efterlevnad.
                    </p>
                </div>

                {/* PRODUKT */}
                <div>
                    <h3 className="text-white font-medium mb-4">Produkt</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/product" className="hover:text-white transition">Platform</Link></li>
                        <li><Link to="/trust-engine" className="hover:text-emerald-400 transition flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Trust Engine</Link></li>
                        <li><Link to="/pricing" className="hover:text-white transition">Priser</Link></li>
                        <li><Link to="/security" className="hover:text-white transition">Säkerhet</Link></li>
                    </ul>
                </div>

                {/* LÖSNINGAR */}
                <div>
                    <h3 className="text-white font-medium mb-4">Lösningar</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/solutions#ekonomi" className="hover:text-white transition">För Ekonomiteam</Link></li>
                        <li><Link to="/solutions#byraer" className="hover:text-white transition">För Redovisningsbyråer</Link></li>
                        <li><Link to="/solutions#enterprise" className="hover:text-white transition">Enterprise</Link></li>
                    </ul>
                </div>

                {/* LEGAL (Canon Mandate) */}
                <div>
                    <h3 className="text-white font-medium mb-4">Legal & Compliance</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/legal" className="hover:text-white transition">Juridisk Hub (Legal)</Link></li>
                        <li><Link to="/legal" className="hover:text-white transition">Integritetspolicy</Link></li>
                        <li><Link to="/legal" className="hover:text-white transition">Användarvillkor</Link></li>
                        <li><Link to="/faq" className="hover:text-white transition">Risk & Ansvar (FAQ)</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
                <p>© 2025 Valiflow AB. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link to="/legal" className="hover:text-slate-400">Privacy</Link>
                    <Link to="/legal" className="hover:text-slate-400">Terms</Link>
                    <a href="mailto:info@valiflow.se" className="hover:text-slate-400">Contact</a>
                </div>
            </div>
        </footer>
    );
}
