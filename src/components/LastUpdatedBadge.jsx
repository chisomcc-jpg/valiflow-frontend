import React, { useEffect, useState } from "react";
import { bureauSettingsService } from "@/services/bureauSettingsService";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export function LastUpdatedBadge({ section }) {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        bureauSettingsService.getLastUpdated(section).then(setInfo).catch(() => { });
    }, [section]);

    if (!info) return null;

    return (
        <div className="text-xs text-slate-400 mt-1 mb-4">
            Senast ändrad av: <span className="font-medium text-slate-600">{info.user}</span> ({format(new Date(info.timestamp), "yyyy-MM-dd 'kl.' HH:mm", { locale: sv })})
        </div>
    );
}
