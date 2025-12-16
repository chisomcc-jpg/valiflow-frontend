import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { getAuthUrl } from "@/services/integrationsService";
import { toast } from "sonner";

export default function IntegrationPopup({ isOpen, onClose, service, title, description, features }) {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            const { url } = await getAuthUrl(service);
            window.location.href = url;
        } catch (err) {
            console.error(err);
            toast.error("Kunde inte starta integrationen.");
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${service === 'fortnox' ? 'bg-[#A3D154]/20 text-[#A3D154]' :
                                service === 'visma' ? 'bg-[#EF4136]/20 text-[#EF4136]' :
                                    'bg-[#0078D4]/20 text-[#0078D4]'
                            }`}>
                            {/* Simple generic logo placeholder */}
                            <span className="font-bold text-lg">{service[0].toUpperCase()}</span>
                        </div>
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-slate-500">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    {features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Avbryt
                    </Button>
                    <Button
                        onClick={handleConnect}
                        disabled={loading}
                        className={`${service === 'fortnox' ? 'bg-[#A3D154] hover:bg-[#8ec241] text-zinc-900 border-none' :
                                service === 'visma' ? 'bg-[#EF4136] hover:bg-[#d63025] text-white' :
                                    'bg-[#0078D4] hover:bg-[#005a9e] text-white'
                            }`}
                    >
                        {loading ? "Ansluter..." : `Fortsätt till ${title.split(' ')[1]}`}
                        {!loading && <ArrowRightIcon className="w-4 h-4 ml-2" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
