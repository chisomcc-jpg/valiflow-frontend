import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { bureauService } from "@/services/bureauService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PERMISSIONS = [
    { id: "view_all_customers", label: "Visa alla kunder" },
    { id: "manage_users", label: "Hantera användare" },
    { id: "edit_roles", label: "Hantera roller" },
    { id: "view_risk", label: "Se riskanalys" },
    { id: "generate_reports", label: "Generera rapporter" },
    { id: "manage_suppliers", label: "Hantera leverantörer" },
    { id: "view_audit_log", label: "Se aktivitetslogg" },
    { id: "manage_integrations", label: "Hantera integrationer" },
];

export function RoleDetailSheet({ role, open, onOpenChange, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState({});
    const [name, setName] = useState("");

    useEffect(() => {
        if (role) {
            setPermissions(role.permissions || {});
            setName(role.name);
        } else {
            setPermissions({});
            setName("");
        }
    }, [role]);

    const handleSave = async () => {
        setLoading(true);
        try {
            if (role?.id) {
                await bureauService.updateRole(role.id, { name, permissions });
                toast.success("Roll uppdaterad");
            } else {
                await bureauService.createRole({ name, permissions });
                toast.success("Roll skapad");
            }
            onSuccess();
            onOpenChange(false);
        } catch (e) {
            console.error(e);
            toast.error("Kunde inte spara roll.");
        } finally {
            setLoading(false);
        }
    };

    const togglePerm = (id) => {
        setPermissions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{role ? "Redigera Roll" : "Ny Roll"}</SheetTitle>
                    <SheetDescription>Ställ in behörigheter för denna roll.</SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Rollnamn</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="t.ex. Junior Revisor" />
                    </div>

                    <div className="space-y-3">
                        <Label>Behörigheter</Label>
                        <div className="space-y-2 border border-slate-200 rounded-lg p-4 bg-slate-50">
                            {PERMISSIONS.map(p => (
                                <div key={p.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={p.id}
                                        checked={!!permissions[p.id]}
                                        onCheckedChange={() => togglePerm(p.id)}
                                    />
                                    <label htmlFor={p.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                        {p.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Avbryt</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Spara Roll
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
