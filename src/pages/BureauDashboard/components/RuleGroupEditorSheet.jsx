import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
// Note: Checkbox must exist in shadcn/ui. If not, I will rely on native or multi-select dropdown.
// Assuming Checkbox exists based on previous work request.
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { automationService } from "@/services/automationService";

export function RuleGroupEditorSheet({ open, onOpenChange, group, rules = [], onSuccess }) {
    const isEdit = !!group;
    const [loading, setLoading] = useState(false);

    // Form
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        ruleIds: [],
        scopeType: "all",
        status: "active"
    });

    useEffect(() => {
        if (open) {
            if (group) {
                setFormData({
                    name: group.name || "",
                    description: group.description || "",
                    ruleIds: group.ruleIds || [],
                    scopeType: group.scope?.type || "all",
                    status: group.status || "active"
                });
            } else {
                setFormData({
                    name: "",
                    description: "",
                    ruleIds: [],
                    scopeType: "all",
                    status: "active"
                });
            }
        }
    }, [open, group]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleRule = (ruleId) => {
        setFormData(prev => {
            const current = prev.ruleIds;
            if (current.includes(ruleId)) {
                return { ...prev, ruleIds: current.filter(id => id !== ruleId) };
            } else {
                return { ...prev, ruleIds: [...current, ruleId] };
            }
        });
    };

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("Ange ett gruppnamn.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                ruleIds: formData.ruleIds,
                scope: { type: formData.scopeType },
                status: formData.status
            };

            if (isEdit) {
                await automationService.updateRuleGroup(group.id, payload);
                toast.success("Grupp uppdaterad!");
            } else {
                await automationService.createRuleGroup(payload);
                toast.success("Grupp skapad!");
            }
            onSuccess();
        } catch (err) {
            toast.error("Kunde inte spara gruppen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[600px] flex flex-col h-full overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEdit ? "Redigera regelgrupp" : "Ny regelgrupp"}</SheetTitle>
                    <SheetDescription>
                        Gruppera regler för enklare hantering av flera kunder.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-6 py-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Gruppnamn</Label>
                            <Input
                                placeholder="t.ex. Standardpaket Fastigheter"
                                value={formData.name}
                                onChange={e => handleChange("name", e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Kort beskrivning</Label>
                            <Textarea
                                placeholder="Vad innehåller detta paket?"
                                value={formData.description}
                                onChange={e => handleChange("description", e.target.value)}
                            />
                            <p className="text-xs text-slate-500">
                                Använd grupper för att samla standardregler som ska gälla för flera kunder.
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label>Välj regler att inkludera</Label>
                        <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                            {rules.length === 0 && (
                                <div className="p-4 text-center text-sm text-slate-500">Inga regler skapade än.</div>
                            )}
                            {rules.map(rule => (
                                <div key={rule.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                                    <Label htmlFor={`rule-${rule.id}`} className="flex-1 cursor-pointer">
                                        <p className="font-medium">{rule.name}</p>
                                        <p className="text-xs text-slate-500">{rule.trigger}</p>
                                    </Label>
                                    <Checkbox
                                        id={`rule-${rule.id}`}
                                        checked={formData.ruleIds.includes(rule.id)}
                                        onCheckedChange={() => toggleRule(rule.id)}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500">
                            Börja med ett fåtal regler och testa – det går alltid att bygga ut senare.
                        </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label>Vilka kunder gäller gruppen för?</Label>
                        <div className="flex gap-4">
                            <div className={`border rounded-md p-3 flex-1 cursor-pointer hover:bg-slate-50 ${formData.scopeType === "all" ? "ring-2 ring-indigo-500 bg-indigo-50" : ""}`}
                                onClick={() => handleChange("scopeType", "all")}>
                                <p className="font-medium text-sm">Alla kunder</p>
                            </div>
                            <div className={`border rounded-md p-3 flex-1 cursor-pointer hover:bg-slate-50 ${formData.scopeType === "selected" ? "ring-2 ring-indigo-500 bg-indigo-50" : ""}`}
                                onClick={() => handleChange("scopeType", "selected")}>
                                <p className="font-medium text-sm">Specifika kunder</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <Label>Status</Label>
                        <Switch
                            checked={formData.status === "active"}
                            onCheckedChange={checked => handleChange("status", checked ? "active" : "inactive")}
                        />
                    </div>
                </div>

                <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Avbryt</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading ? "Sparar..." : (isEdit ? "Spara ändringar" : "Skapa grupp")}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
