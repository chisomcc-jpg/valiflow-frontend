// src/demo/pages/DemoAIAssistant.jsx
import React, { useState } from "react";
import { SparklesIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoAIAssistant() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hej! Jag är Valiflows AI-assistent. Jag har analyserat dina 46 demo-fakturor. Vad vill du veta?' }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            setIsTyping(false);
            const response = getDemoResponse(input);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        }, 1500);
    };

    const getDemoResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes("risk") || q.includes("flag")) return "Jag har hittat 6 fakturor med förhöjd risknivå. Den mest kritiska är från 'Global Import Export LTD' (TrustScore 45) där bankgirot inte matchar tidigare historik.";
        if (q.includes("moms") || q.includes("vat")) return "Momsanalysen visar att 2 fakturor har avvikande momssatser gentemot leverantörens branschsnitt. Vill du att jag listar dem?";
        if (q.includes("leverantör")) return "Du har 12 aktiva leverantörer i demo-miljön. 'Nordic Clean Energy AB' har högst TrustScore (94).";
        return "Detta är en demo-miljö, så jag kan bara svara på frågor om demo-datan. Försök fråga om 'risker', 'leverantörer' eller 'avvikelser'.";
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {messages.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
              max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
              ${m.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}
            `}>
                            {m.role === 'assistant' && (
                                <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">
                                    <SparklesIcon className="w-4 h-4" /> AI Insight
                                </div>
                            )}
                            {m.content}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
                    <input
                        type="text"
                        className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        placeholder="Fråga Valiflow om dina fakturor..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-2 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50"
                    >
                        <PaperAirplaneIcon className="w-5 h-5 -rotate-45 translate-x-[-1px] translate-y-[1px]" />
                    </Button>
                </form>
                <div className="text-center mt-3 text-xs text-slate-400">
                    AI kan göra misstag. Kontrollera alltid viktig information.
                </div>
            </div>
        </div>
    );
}
