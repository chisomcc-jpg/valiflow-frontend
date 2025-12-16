import React from 'react';
import BureauTeam from "@/pages/BureauDashboard/BureauTeam";
import { demoBureauMock } from "@/demo/demoBureauMock";

export default function DemoBureauTeam() {
    const teamData = {
        users: demoBureauMock.team.members,
        logs: demoBureauMock.team.activityLog,
        // Mock Roles & Access Map if needed for display consistency
        roles: [
            { id: 1, name: "Revisor", description: "Fullständig insyn" },
            { id: 2, name: "Redovisningskonsult", description: "Bokföring och hantering" },
        ],
        accessMap: demoBureauMock.customers.map(c => ({
            id: c.id,
            name: c.name,
            users: demoBureauMock.team.members.slice(0, 2)
        }))
    };

    return (
        <BureauTeam demoMode={true} demoOverrideData={teamData} />
    );
}
