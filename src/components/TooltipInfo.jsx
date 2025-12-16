import React from "react";
import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipInfo({ text }) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help inline-block ml-2 align-middle" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm bg-slate-900 text-white">
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
