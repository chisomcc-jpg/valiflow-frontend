import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    PaperAirplaneIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    LightBulbIcon,
    DocumentMagnifyingGlassIcon,
    ArrowLongLeftIcon,
    BoltIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext"; // Fixed import path
import { api } from "@/services/api";

export default function AIAssistant() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Context from previous page
    const fromRoute = location.state?.from || "/dashboard";
    const contextData = location.state?.contextData || null;

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Hej ${user?.name?.split(" ")[0] || "där"}! Jag är din Valiflow AI-assistent. Jag är redo att analysera din data.`
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Suggestions based on context
    const getSuggestions = () => {
        if (fromRoute.includes("invoices")) {
            return [
                "Analysera senaste fakturan från Telia",
                "Visa fakturor med låg trust",
                "Vad är trenden för kreditfakturor?",
                "Hitta dubbletter i fakturaflödet"
            ];
        }
        if (fromRoute.includes("suppliers")) {
            return [
                "Vilka leverantörer har sämst kreditbetyg?",
                "Sammanställ utgifter per leverantör",
                "Finns det kopplingar till svarta listan?",
                "Analysera Leverantör ABs ägarstruktur"
            ];
        }
        if (fromRoute.includes("fraud") || fromRoute.includes("risk")) {
            return [
                "Förklara varför faktura #10293 flaggades",
                "Hur kan jag minska risken för bluffakturor?",
                "Visa alla avvikelser från igår"
            ];
        }
        return [
            "Vad är min totala riskexponering?",
            "Summera veckans händelser",
            "Visa viktigaste att göra idag"
        ];
    };

    const suggestions = getSuggestions();

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial Context Message
    useEffect(() => {
        if (fromRoute !== "/dashboard") {
            setTimeout(() => {
                const pageName = fromRoute.split("/").pop();
                setMessages(prev => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `Jag ser att du kommer från **${pageName}**. Jag har laddat in din kontext därifrån.`,
                        isContext: true
                    }
                ]);
            }, 600);
        }
    }, [fromRoute]);

    const handleSend = async (forcedPrompt = null) => {
        const prompt = forcedPrompt || input;
        if (!prompt.trim()) return;

        // Add user message immediately
        const userMsg = { role: "user", content: prompt };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await api.post("/ai/assistant", {
                message: prompt,
                context: {
                    route: fromRoute,
                    companyId: user.companyId,
                    extraData: contextData
                }
            });

            const replyText = res.data.reply;

            setIsTyping(false);

            // Streaming Effect (Typing animation)
            const newMsgId = Date.now();
            setMessages(prev => [...prev, { role: "assistant", content: "", id: newMsgId }]);

            let i = 0;
            const speed = 15; // ms per char
            const streamInterval = setInterval(() => {
                if (i < replyText.length) {
                    setMessages(prev => prev.map(msg =>
                        msg.id === newMsgId ? { ...msg, content: replyText.slice(0, i + 1) } : msg
                    ));
                    i++;
                    scrollToBottom();
                } else {
                    clearInterval(streamInterval);
                }
            }, speed);

        } catch (err) {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: "assistant", content: "Ursäkta, jag tappade kontakten med servern. Försök igen." }]);
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6">
            {/* LEFT: Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-slate-800">Valiflow AI Assistent</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">Enterprise</span>
                    </div>
                    <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
                        <ArrowLongLeftIcon className="w-4 h-4" />
                        Tillbaka
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                      max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                      ${m.role === 'user'
                                    ? 'bg-[#1E5CB3] text-white rounded-tr-sm'
                                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'}
                      ${m.isContext ? 'border-l-4 border-l-indigo-400 bg-indigo-50/50' : ''}
                   `}>
                                {m.content}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-100" />
                                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 bg-white">
                    <div className="relative flex items-center">
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Ställ en fråga om dina fakturor eller risker..."
                            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none h-14"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 p-2 bg-[#1E5CB3] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-2">
                        Valiflow AI (Master Prompt v2) kan göra misstag. Kontrollera viktig information.
                    </p>
                </div>
            </div>

            {/* RIGHT: Context Panel */}
            <div className="w-80 hidden lg:flex flex-col gap-4">
                {/* Recent Context */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-slate-500">
                        <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Aktiv Context</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-slate-700 mb-1">Källa</p>
                        <div className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-mono break-all">
                            {fromRoute}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-slate-500">
                        <BoltIcon className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Snabbåtgärder</span>
                    </div>
                    <div className="space-y-2">
                        <button onClick={() => handleSend("Visa fakturor med låg trust")} className="w-full text-xs text-left p-2 rounded hover:bg-slate-50 text-indigo-600 font-medium border border-transparent hover:border-indigo-100 transition-all">
                            ⚡ Visa låg trust
                        </button>
                        <button onClick={() => handleSend("Förklara avvikelser senaste 7 dagar")} className="w-full text-xs text-left p-2 rounded hover:bg-slate-50 text-indigo-600 font-medium border border-transparent hover:border-indigo-100 transition-all">
                            ⚡ Förklara avvikelser
                        </button>
                        <button onClick={() => handleSend("Sammanfatta leverantörsrisker")} className="w-full text-xs text-left p-2 rounded hover:bg-slate-50 text-indigo-600 font-medium border border-transparent hover:border-indigo-100 transition-all">
                            ⚡ Sammanfatta risker
                        </button>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1">
                    <div className="flex items-center gap-2 mb-4 text-slate-500">
                        <LightBulbIcon className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Förslag</span>
                    </div>
                    <div className="space-y-2">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(s)}
                                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-colors text-xs text-slate-700 leading-snug"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
