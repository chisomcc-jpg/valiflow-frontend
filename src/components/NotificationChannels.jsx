import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function NotificationChannels({ value = { email: true, app: true }, onChange }) {
    const handleChange = (key, checked) => {
        onChange?.({ ...value, [key]: checked });
    };

    return (
        <div className="flex gap-4 mt-2">
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="channel-email"
                    checked={value.email}
                    onCheckedChange={(c) => handleChange("email", c)}
                />
                <label
                    htmlFor="channel-email"
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                >
                    E-post
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="channel-app"
                    checked={value.app}
                    onCheckedChange={(c) => handleChange("app", c)}
                />
                <label
                    htmlFor="channel-app"
                    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                >
                    Valiflow-notiser
                </label>
            </div>
        </div>
    );
}
