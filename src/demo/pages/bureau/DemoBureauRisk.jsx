import React from 'react';
import BureauRiskcenter from "@/pages/BureauDashboard/BureauRiskcenter";
import { demoBureauMock } from "@/demo/demoBureauMock";

export default function DemoBureauRisk() {
    return (
        <BureauRiskcenter demoMode={true} demoOverrideData={demoBureauMock.riskCenter} />
    );
}
