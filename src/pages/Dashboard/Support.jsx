import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    PlusIcon,
    TicketIcon,
    XMarkIcon,
    ChevronRightIcon,
    UserCircleIcon,
    CpuChipIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { toast } from 'sonner';

import {
    getTickets,
    createTicket,
    addMessage,
    updateTicketStatus,
    sendAiMessage
} from '@/services/supportService';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Support() {
    // State
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // AI Chat State
    const [aiInput, setAiInput] = useState("");
    const [aiMessages, setAiMessages] = useState([
        { role: 'assistant', text: 'Hej! Jag är Valiflow AI. Hur kan jag hjälpa dig idag?' }
    ]);
    const [aiLoading, setAiLoading] = useState(false);
    const chatEndRef = useRef(null);

    // New Ticket State
    const [newTicket, setNewTicket] = useState({ title: '', category: 'General', priority: 'medium', description: '' });
    const [isCreating, setIsCreating] = useState(false);

    // Reply State
    const [replyMessage, setReplyMessage] = useState("");

    // Effects
    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages]);

    // Data Loading
    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = await getTickets();
            setTickets(data.items || []);
        } catch (err) {
            toast.error("Kunde inte ladda ärenden");
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleAiSend = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;

        const userMsg = aiInput;
        setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setAiInput("");
        setAiLoading(true);

        try {
            const res = await sendAiMessage(userMsg);
            setAiMessages(prev => [...prev, { role: 'assistant', text: res.message }]);
        } catch (err) {
            setAiMessages(prev => [...prev, { role: 'assistant', text: 'Tyvärr kan jag inte svara just nu. Vänligen skapa ett ärende.' }]);
        } finally {
            setAiLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            setIsCreating(true);
            await createTicket(newTicket);
            toast.success("Ärende skapat");
            setNewTicket({ title: '', category: 'General', priority: 'medium', description: '' });
            loadTickets();
        } catch (err) {
            toast.error("Kunde inte skapa ärende");
        } finally {
            setIsCreating(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedTicket) return;

        try {
            const newMsg = await addMessage(selectedTicket.id, replyMessage);
            // Optimistic update
            const updatedTicket = {
                ...selectedTicket,
                messages: [...selectedTicket.messages, newMsg]
            };
            setSelectedTicket(updatedTicket);
            setReplyMessage("");

            // Also update list if needed (not strictly necessary for details view)
        } catch (err) {
            toast.error("Kunde inte skicka svar");
        }
    };

    const handleStatusChange = async (status) => {
        if (!selectedTicket) return;
        try {
            await updateTicketStatus(selectedTicket.id, status);
            setSelectedTicket({ ...selectedTicket, status });
            toast.success(`Status uppdaterad till ${status}`);
            loadTickets(); // Refresh list
        } catch (err) {
            toast.error("Kunde inte uppdatera status");
        }
    };

    // Render Helpers
    const getStatusBadge = (status) => {
        switch (status) {
            case 'open': return <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Öppen</Badge>;
            case 'closed': return <Badge variant="secondary">Stängd</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 pb-20 font-sans">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Supportcenter</h1>
                    <p className="text-slate-500 mt-1">Hur kan vi hjälpa dig idag?</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-slate-600">Valiflow AI – Online</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COL: AI CHAT */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="h-[600px] flex flex-col shadow-sm border-slate-200 overflow-hidden">
                        <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <CpuChipIcon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-indigo-900">Valiflow AI</CardTitle>
                                    <CardDescription className="text-indigo-600/80 text-xs">Alltid redo att svara</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 flex flex-col bg-white">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                {aiMessages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'
                                            }`}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                                {aiLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleAiSend} className="p-4 bg-white border-t border-slate-100">
                                <div className="flex gap-2">
                                    <Input
                                        value={aiInput}
                                        onChange={e => setAiInput(e.target.value)}
                                        placeholder="Fråga om fakturor..."
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={aiLoading || !aiInput.trim()}>
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COL: TICKETS */}
                <div className="lg:col-span-2 space-y-8">

                    {/* CREATE TICKET */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <PlusIcon className="w-5 h-5 text-slate-400" />
                                Skapa nytt ärende
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateTicket} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700">Titel</label>
                                        <Input
                                            required
                                            placeholder="Vad handlar det om?"
                                            value={newTicket.title}
                                            onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700">Kategori</label>
                                            <Select value={newTicket.category} onValueChange={v => setNewTicket({ ...newTicket, category: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General">Allmänt</SelectItem>
                                                    <SelectItem value="Invoice">Fakturafrågor</SelectItem>
                                                    <SelectItem value="Technical">Tekniskt fel</SelectItem>
                                                    <SelectItem value="Account">Konto & Inloggning</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700">Prioritet</label>
                                            <Select value={newTicket.priority} onValueChange={v => setNewTicket({ ...newTicket, priority: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Låg</SelectItem>
                                                    <SelectItem value="medium">Normal</SelectItem>
                                                    <SelectItem value="high">Hög</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col h-full">
                                    <label className="text-sm font-medium text-slate-700 mb-1">Beskrivning</label>
                                    <Textarea
                                        required
                                        className="flex-1 min-h-[120px]"
                                        placeholder="Beskriv problemet så detaljerat som möjligt..."
                                        value={newTicket.description}
                                        onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                    <Button type="submit" disabled={isCreating}>
                                        {isCreating ? "Skapar..." : "Skicka ärende"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* TICKET LIST */}
                    <Card className="shadow-sm border-slate-200 overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
                            <CardTitle className="text-base font-medium text-slate-700">Mina ärenden</CardTitle>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-slate-500 bg-white border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">ID</th>
                                        <th className="px-6 py-3 font-medium">Ämne</th>
                                        <th className="px-6 py-3 font-medium">Kategori</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Skapad</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {loading ? (
                                        <tr><td colSpan={6} className="text-center py-8 text-slate-400">Laddar...</td></tr>
                                    ) : tickets.length === 0 ? (
                                        <tr><td colSpan={6} className="text-center py-8 text-slate-400 italic">Inga ärenden hittades.</td></tr>
                                    ) : (
                                        tickets.map(t => (
                                            <tr key={t.id} onClick={() => setSelectedTicket(t)} className="hover:bg-slate-50 cursor-pointer group transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-500 text-xs">#{t.id}</td>
                                                <td className="px-6 py-4 font-medium text-slate-900">{t.title}</td>
                                                <td className="px-6 py-4 text-slate-600">{t.category}</td>
                                                <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                                                <td className="px-6 py-4 text-slate-500">{format(new Date(t.createdAt), 'yyyy-MM-dd')}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            {/* DETAIL SLIDE-OVER */}
            <AnimatePresence>
                {selectedTicket && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTicket(null)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="bg-white">#{selectedTicket.id}</Badge>
                                        {getStatusBadge(selectedTicket.status)}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedTicket.title}</h2>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(null)}>
                                    <XMarkIcon className="w-6 h-6 text-slate-400" />
                                </Button>
                            </div>

                            {/* Conversation */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                                {/* Original Description */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <UserCircleIcon className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm text-slate-900">Du</span>
                                                <span className="text-xs text-slate-400">{format(new Date(selectedTicket.createdAt), 'yyyy-MM-dd HH:mm')}</span>
                                            </div>
                                            <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                {selectedTicket.description}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedTicket.messages?.map((msg, i) => (
                                        <div key={msg.id || i} className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-100' : 'bg-indigo-100'
                                                }`}>
                                                {msg.sender === 'user' ? (
                                                    <UserCircleIcon className="w-5 h-5 text-slate-500" />
                                                ) : (
                                                    <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-sm text-slate-900">
                                                        {msg.sender === 'user' ? 'Du' : 'Support'}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {msg.createdAt ? format(new Date(msg.createdAt), 'yyyy-MM-dd HH:mm') : 'Nyss'}
                                                    </span>
                                                </div>
                                                <div className={`text-sm p-4 rounded-lg border ${msg.sender === 'user'
                                                        ? 'bg-slate-50 border-slate-100 text-slate-700'
                                                        : 'bg-white border-indigo-100 text-slate-800 shadow-sm'
                                                    }`}>
                                                    {msg.message}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer / Reply */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50">
                                {selectedTicket.status === 'closed' ? (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-slate-500 mb-2">Detta ärende är stängt.</p>
                                        <Button variant="outline" size="sm" onClick={() => handleStatusChange('open')}>
                                            Öppna ärendet igen
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleReply} className="space-y-4">
                                        <Textarea
                                            placeholder="Skriv ett svar..."
                                            className="min-h-[100px] bg-white"
                                            value={replyMessage}
                                            onChange={e => setReplyMessage(e.target.value)}
                                        />
                                        <div className="flex justify-between items-center">
                                            <Button variant="ghost" size="sm" type="button" onClick={() => handleStatusChange('closed')} className="text-slate-500 hover:text-red-600">
                                                Stäng ärende
                                            </Button>
                                            <Button type="submit" disabled={!replyMessage.trim()}>
                                                Skicka svar
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
