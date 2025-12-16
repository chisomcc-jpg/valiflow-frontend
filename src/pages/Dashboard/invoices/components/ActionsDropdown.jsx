
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    EllipsisHorizontalIcon,
    EyeIcon,
    FlagIcon,
    ArrowTopRightOnSquareIcon,
    DocumentMagnifyingGlassIcon,
    ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function ActionsDropdown({ invoice, onOpen, onFlag }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2">
                <DropdownMenuItem onClick={() => onOpen(invoice.id)} className="cursor-pointer font-medium">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Öppna faktura
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer text-slate-600">
                    <DocumentMagnifyingGlassIcon className="w-4 h-4 mr-2" />
                    Visa metadata
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-slate-600">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    Visa riskdetaljer
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-slate-600">
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                    Gå till leverantör
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onFlag(invoice.id)} className="cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                    <FlagIcon className="w-4 h-4 mr-2" />
                    Flagga för utredning
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
