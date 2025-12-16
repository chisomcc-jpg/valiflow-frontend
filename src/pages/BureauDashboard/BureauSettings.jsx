
import React, { useState } from "react";
import {
    Settings,
    Building,
    Users,
    Key,
    Zap,
    Bell,
    Shield,
    Link as LinkIcon,
    Sparkles,
    User
} from "lucide-react";
import { cn } from "@/lib/utils";

import { AgencyProfileCard } from "./components/AgencyProfileCard";
import { TeamAndRolesSettings } from "./components/TeamAndRolesSettings";
import { CustomerAccessSettings } from "./components/CustomerAccessSettings";
import { AutomationPolicySettings } from "./components/AutomationPolicySettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { IntegrationSettings } from "./components/IntegrationSettings";
import { AISettingsCard } from "./components/AISettingsCard";
import { MyProfileSettings } from "./components/MyProfileSettings";

const NAV_GROUPS = [
    {
        title: "Min profil",
        items: [
            { id: "my-profile", label: "Min profil", icon: User, component: MyProfileSettings }
        ]
    },
    {
        title: "Byråinställningar",
        items: [
            { id: "profile", label: "Byråprofil", icon: Building, component: AgencyProfileCard },
            { id: "team", label: "Team & Roller", icon: Users, component: TeamAndRolesSettings },
            { id: "access", label: "Kundbehörigheter", icon: Key, component: CustomerAccessSettings },
            { id: "automation", label: "Automation", icon: Zap, component: AutomationPolicySettings },
            { id: "notifications", label: "Notifieringar", icon: Bell, component: NotificationSettings },
            { id: "security", label: "Säkerhet", icon: Shield, component: SecuritySettings },
            { id: "integrations", label: "Integrationer", icon: LinkIcon, component: IntegrationSettings },
            { id: "ai", label: "AI & Analys", icon: Sparkles, component: AISettingsCard },
        ]
    }
];

export default function BureauSettings() {
    const [activeSection, setActiveSection] = useState("my-profile");

    // Flatten to find active component
    const allItems = NAV_GROUPS.flatMap(g => g.items);
    const ActiveComponent = allItems.find(item => item.id === activeSection)?.component || MyProfileSettings;

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
                <div className="max-w-[1600px] mx-auto">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Settings className="w-7 h-7 text-indigo-600" />
                        Inställningar
                    </h1>
                    <p className="text-slate-500 mt-1">Hantera din profil och byråns globala inställningar.</p>
                </div>
            </header>

            {/* LAYOUT CONTAINER */}
            <div className="max-w-[1600px] mx-auto px-8 mt-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR NAVIGATION */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <nav className="space-y-6">
                            {NAV_GROUPS.map((group, idx) => (
                                <div key={idx}>
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">
                                        {group.title}
                                    </h3>
                                    <div className="space-y-1">
                                        {group.items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveSection(item.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                                    activeSection === item.id
                                                        ? "bg-indigo-50 text-indigo-700"
                                                        : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
                                                )}
                                            >
                                                <item.icon className={cn("w-5 h-5", activeSection === item.id ? "text-indigo-600" : "text-slate-400")} />
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 min-w-0">
                        <div className="max-w-[1000px]">
                            <ActiveComponent />
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}
