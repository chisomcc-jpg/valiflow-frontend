import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { bureauService } from "@/services/bureauService";
import { toast } from "sonner";
import { Loader2, UserPlus, X } from "lucide-react";

export function AccessManagementSheet({ customer, open, onOpenChange, users, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");

    if (!customer) return null;

    const assignedUsers = customer.users || [];
    // Filter out already assigned
    const availableUsers = users.filter(u => !assignedUsers.find(au => au.id === u.id));

    const handleGrant = async () => {
        if (!selectedUser) return;
        setLoading(true);
        try {
            await bureauService.grantAccess(selectedUser, customer.id);
            toast.success("Tillgång tilldelad");
            setSelectedUser("");
            onSuccess();
        } catch (e) {
            toast.error("Kunde inte ge tillgång.");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (userId) => {
        if (!confirm("Ta bort tillgång för denna användare?")) return;
        try {
            await bureauService.revokeAccess(userId, customer.id);
            toast.success("Tillgång borttagen");
            onSuccess();
        } catch (e) {
            toast.error("Kunde inte ta bort tillgång.");
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Hantera tillgång: {customer.name}</SheetTitle>
                    <SheetDescription>Koppla specifika användare till kundbolaget.</SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">

                    {/* ADD ACCESS */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <h4 className="text-sm font-semibold">Lägg till användare</h4>
                        <div className="flex gap-2">
                            <Select value={selectedUser} onValueChange={setSelectedUser}>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Välj användare..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableUsers.map(u => (
                                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleGrant} disabled={!selectedUser || loading} size="icon">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* CURRENT LIST */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Behöriga användare ({assignedUsers.length})</h4>
                        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                            {assignedUsers.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">Inga användare tilldelade.</div>
                            ) : assignedUsers.map(u => (
                                <div key={u.id} className="p-3 flex justify-between items-center text-sm bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">
                                            {u.name.charAt(0)}
                                        </div>
                                        <span className="font-medium">{u.name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleRevoke(u.id)} className="text-slate-400 hover:text-red-600">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
