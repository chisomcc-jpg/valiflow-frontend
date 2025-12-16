import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Assuming avatar exists or standard html
import { bureauService } from "@/services/bureauService";
import { toast } from "sonner";
import { Loader2, ShieldAlert, Trash2, Ban } from "lucide-react";
import { format } from "date-fns";

export function UserDetailSheet({ user, open, onOpenChange, roles, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user?.roleId);

    // Sync state when user opens
    useEffect(() => {
        if (user) setSelectedRole(user.roleId);
    }, [user]);

    if (!user) return null;

    const handleUpdateRole = async () => {
        if (selectedRole === user.roleId) return;
        setLoading(true);
        try {
            await bureauService.updateTeamMember(user.id, { roleId: selectedRole });
            toast.success("Roll uppdaterad!");
            onSuccess();
        } catch (e) {
            toast.error("Kunde inte uppdatera roll.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Är du säker på att du vill ta bort denna användare?")) return;
        try {
            await bureauService.deleteTeamMember(user.id);
            toast.success("Användare borttagen.");
            onSuccess();
            onOpenChange(false);
        } catch (e) {
            toast.error("Fel vid borttagning.");
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <SheetTitle className="text-xl">{user.name}</SheetTitle>
                            <SheetDescription>{user.email}</SheetDescription>
                            <div className="mt-2 flex gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {user.status === 'ACTIVE' ? 'Aktiv' : 'Inbjuden'}
                                </span>
                                <span className="text-xs text-slate-500 py-0.5">
                                    Skapad {format(new Date(user.createdAt), "yyyy-MM-dd")}
                                </span>
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    {/* ROLE MANAGEMENT */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Roll & Behörighet</h3>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map(r => (
                                            <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                onClick={handleUpdateRole}
                                disabled={loading || selectedRole === user.roleId}
                                variant="secondary"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Spara"}
                            </Button>
                        </div>
                    </div>

                    {/* CUSTOMER ACCESS LIST */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Kundtillgångar</h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            {(user.access?.length === 0) ? (
                                <div className="p-4 text-center text-sm text-slate-500">Inga specifika kunder tilldelade.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {user.access?.map(a => (
                                        <div key={a.id} className="p-3 bg-white flex justify-between items-center text-sm">
                                            <span>Kund ID: {a.customerId}</span>
                                            <Button variant="ghost" size="sm" className="h-6 text-red-500">Ta bort</Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button variant="outline" className="w-full rounded-t-none border-t-0 border-x-0 border-b-0 bg-slate-50 text-indigo-600 text-xs">
                                Hantera tillgångar
                            </Button>
                        </div>
                    </div>

                    {/* DANGER ZONE */}
                    <div className="pt-6 border-t border-slate-200">
                        <h3 className="text-sm font-semibold text-red-600 mb-2">Accesskontroll</h3>
                        <div className="flex gap-3">
                            <Button variant="destructive" onClick={handleDelete} className="w-full">
                                <Trash2 className="w-4 h-4 mr-2" /> Ta bort användare
                            </Button>
                            {user.status !== "BLOCKED" && (
                                <Button variant="outline" className="w-full text-amber-700 border-amber-200 hover:bg-amber-50">
                                    <Ban className="w-4 h-4 mr-2" /> Inaktivera
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
