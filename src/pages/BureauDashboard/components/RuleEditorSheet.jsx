import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, TrashIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { automationService } from "@/services/automationService";

export function RuleEditorSheet({ open, onOpenChange, rule, onSuccess }) {
    const isEdit = !!rule;
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        trigger: "invoice_scanned",
        actionType: "flag_invoice",
        scopeType: "all",
        status: "active",
        conditions: []
    });

    useEffect(() => {
        if (open) {
            if (rule) {
                setFormData({
                    name: rule.name || "",
                    description: rule.description || "",
                    trigger: rule.trigger || "invoice_scanned",
                    actionType: rule.action?.type || "flag_invoice",
                    scopeType: rule.scope?.type || "all",
                    status: rule.status || "active",
                    conditions: rule.conditions || []
                });
            } else {
                // Reset for new
                setFormData({
                    name: "",
                    description: "",
                    trigger: "invoice_scanned",
                    actionType: "flag_invoice",
                    scopeType: "all",
                    status: "active",
                    conditions: []
                });
            }
        }
    }, [open, rule]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("Ange ett namn på regeln.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                trigger: formData.trigger,
                status: formData.status,
                action: { type: formData.actionType }, // scalable
                scope: { type: formData.scopeType },   // scalable
                conditions: formData.conditions
            };

            if (isEdit) {
                await automationService.updateRule(rule.id, payload);
                toast.success("Regel uppdaterad!");
            } else {
                await automationService.createRule(payload);
                toast.success("Regel skapad!");
            }
            onSuccess();
        } catch (err) {
            console.error(err);
            toast.error("Kunde inte spara regeln.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[600px] flex flex-col h-full overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEdit ? "Redigera regel" : "Ny automationsregel"}</SheetTitle>
                    <SheetDescription>
                        Konfigurera triggers och åtgärder för att automatisera flöden.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-6 py-6">

                    {/* 1. NAMN & BESKRIVNING */}
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Regelnamn</Label>
                            <Input
                                placeholder="t.ex. Flagga nya leverantörer"
                                value={formData.name}
                                onChange={e => handleChange("name", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Kort beskrivning</Label>
                            <Textarea
                                placeholder="Beskriv vad regeln gör..."
                                className="h-20"
                                value={formData.description}
                                onChange={e => handleChange("description", e.target.value)}
                            />
                            <p className="text-xs text-slate-500">
                                Beskriv med enkla ord vad regeln gör. Exempel: "Flagga fakturor över 100 000 kr från nya leverantörer."
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* 2. TRIGGER */}
                    <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                            När ska regeln köras?
                            <InformationCircleIcon className="w-4 h-4 text-slate-400" />
                        </Label>
                        <Select value={formData.trigger} onValueChange={v => handleChange("trigger", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Välj trigger" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="invoice_scanned">Vid fakturascanning</SelectItem>
                                <SelectItem value="vendor_updated">Vid ändrad leverantörsinfo</SelectItem>
                                <SelectItem value="risk_high">Vid hög risknivå</SelectItem>
                                <SelectItem value="payment_changed">Vid ändrat bankgiro</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                            Triggern avgör när systemet ska kontrollera om regeln ska appliceras.
                        </p>
                    </div>

                    <Separator />

                    {/* 3. VILLKOR (MOCKUP FOR NOW) */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Villkor (Valfritt)</Label>
                            <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
                                <PlusIcon className="w-3 h-3 mr-1" /> Lägg till villkor
                            </Button>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-md border text-center text-sm text-slate-500">
                            Avancerad villkorsbyggare kommer snart. Just nu gäller regeln alltid.
                        </div>
                        <p className="text-xs text-slate-500">
                            Du kan lämna villkor tomt om regeln alltid ska köras när triggern inträffar.
                        </p>
                    </div>

                    <Separator />

                    {/* 4. ÅTGÄRD */}
                    <div className="space-y-4">
                        <Label>Vad ska hända när regeln träffar?</Label>
                        <Select value={formData.actionType} onValueChange={v => handleChange("actionType", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Välj åtgärd" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="flag_invoice">Flagga faktura (Varning)</SelectItem>
                                <SelectItem value="block_invoice">Kräv manuell attest</SelectItem>
                                <SelectItem value="notify_admin">Skicka notis till byråadmin</SelectItem>
                                <SelectItem value="log_only">Endast logga händelse</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                            Välj en åtgärd som är lätt att förstå för teamet.
                        </p>
                    </div>

                    <Separator />

                    {/* 5. SCOPE */}
                    <div className="space-y-4">
                        <Label>Vilka kunder gäller regeln för?</Label>
                        <div className="flex gap-4">
                            <div className={`border rounded-md p-3 flex-1 cursor-pointer hover:bg-slate-50 ${formData.scopeType === "all" ? "ring-2 ring-indigo-500 bg-indigo-50" : ""}`}
                                onClick={() => handleChange("scopeType", "all")}>
                                <p className="font-medium text-sm">Alla kunder</p>
                                <p className="text-xs text-slate-500">Gäller alla nuvarande och framtida</p>
                            </div>
                            <div className={`border rounded-md p-3 flex-1 cursor-pointer hover:bg-slate-50 ${formData.scopeType === "selected" ? "ring-2 ring-indigo-500 bg-indigo-50" : ""}`}
                                onClick={() => handleChange("scopeType", "selected")}>
                                <p className="font-medium text-sm">Specifika kunder</p>
                                <p className="text-xs text-slate-500">Välj kunder i nästa steg</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            Håll det enkelt i början – börja med "Alla kunder" och finjustera senare.
                        </p>
                    </div>

                    <Separator />

                    {/* 6. STATUS */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Status</Label>
                            <p className="text-xs text-slate-500">Avaktivera regeln tillfälligt utan att ta bort den.</p>
                        </div>
                        <Switch
                            checked={formData.status === "active"}
                            onCheckedChange={checked => handleChange("status", checked ? "active" : "inactive")}
                        />
                    </div>

                </div>

                <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Avbryt</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading ? "Sparar..." : (isEdit ? "Spara ändringar" : "Skapa regel")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
