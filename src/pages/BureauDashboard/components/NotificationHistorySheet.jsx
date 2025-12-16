import React, { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { bureauSettingsService } from "@/services/bureauSettingsService";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export function NotificationHistorySheet({ open, onOpenChange }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (open) {
            bureauSettingsService.getNotificationHistory().then(setHistory).catch(() => { });
        }
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Identifierade Händelser</SheetTitle>
                    <SheetDescription>
                        De senaste 20 notiserna som skickats till byrån.
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    {history.map((item, idx) => (
                        <div key={idx} className="p-4 border border-slate-100 rounded-lg bg-slate-50/50">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {item.type}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {format(new Date(item.date), "d MMM HH:mm", { locale: sv })}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 mt-2">{item.customer}</p>
                            <p className="text-sm text-slate-600">{item.text}</p>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
