import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { bureauSettingsService } from "@/services/bureauSettingsService";
import { LogoUpload } from "./LogoUpload";
import { ValidationMessage } from "@/components/ValidationMessage";
import { Separator } from "@/components/ui/separator";

export function AgencyProfileCard() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Extended data model
    const [data, setData] = useState({
        name: "",
        orgNumber: "",
        address: "",
        invoiceAddress: "",
        supportEmail: "",
        website: "",
        logoUrl: "",
        billingName: "",  // New
        billingEmail: ""  // New
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const profile = await bureauSettingsService.getProfile();
            setData(prev => ({ ...prev, ...profile }));
        } catch (e) {
            toast.error("Kunde inte ladda profil");
        } finally {
            setLoading(false);
        }
    }

    const validate = () => {
        const newErrors = {};

        // Org nr format: NNNNNN-NNNN (simple check)
        if (data.orgNumber && !/^\d{6}-\d{4}$/.test(data.orgNumber)) {
            newErrors.orgNumber = "Ogiltigt format. Exempel: 556677-8899";
        }

        // Email check
        if (data.supportEmail && !data.supportEmail.includes("@")) {
            newErrors.supportEmail = "Ange en giltig e-postadress.";
        }

        if (data.billingEmail && !data.billingEmail.includes("@")) {
            newErrors.billingEmail = "Ange en giltig e-postadress.";
        }

        // Website http check
        if (data.website && !data.website.startsWith("http")) {
            newErrors.website = "URL måste börja med http:// eller https://";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSave() {
        if (!validate()) {
            toast.error("Korrigera felen innan du sparar.");
            return;
        }

        setSaving(true);
        try {
            await bureauSettingsService.updateProfile(data);
            toast.success("Ändringar sparade.");
        } catch (e) {
            toast.error("Kunde inte spara ändringarna. Försök igen.");
        } finally {
            setSaving(false);
        }
    }

    const handleLogoUpload = (url) => {
        setData(prev => ({ ...prev, logoUrl: url }));
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Laddar...</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Byråprofil</h3>
                    <p className="text-sm text-slate-500">Den här informationen visas i rapporter, exportfiler och kundkommunikation.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                    {saving ? "Sparar..." : "Spara ändringar"}
                </Button>
            </div>

            <div className="mb-8">
                <LogoUpload currentUrl={data.logoUrl} onUpload={handleLogoUpload} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Byrånamn</label>
                    <Input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organisationsnummer</label>
                    <Input value={data.orgNumber} readOnly className="bg-slate-50 text-slate-500 cursor-not-allowed" />
                    <p className="text-xs text-slate-400 mt-1">Kan ej ändras manuellt.</p>
                    <ValidationMessage message={errors.orgNumber} />
                </div>

                {/* Contact */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Support-email</label>
                    <Input value={data.supportEmail} onChange={e => setData({ ...data, supportEmail: e.target.value })} />
                    <p className="text-xs text-slate-400 mt-1">E-postadressen som Valiflow använder för kundnotiser.</p>
                    <ValidationMessage message={errors.supportEmail} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hemsida</label>
                    <Input value={data.website} onChange={e => setData({ ...data, website: e.target.value })} placeholder="https://" />
                    <ValidationMessage message={errors.website} />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Postadress</label>
                    <Input value={data.address} onChange={e => setData({ ...data, address: e.target.value })} />
                </div>
            </div>

            <Separator className="my-8" />

            <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900">Fakturering</h4>
                <p className="text-xs text-slate-500">Uppgifter för inkommande fakturor.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fakturaadress</label>
                    <Input value={data.invoiceAddress} onChange={e => setData({ ...data, invoiceAddress: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fakturerings-email</label>
                    <Input value={data.billingEmail} onChange={e => setData({ ...data, billingEmail: e.target.value })} />
                    <ValidationMessage message={errors.billingEmail} />
                </div>
            </div>
        </div>
    );
}
