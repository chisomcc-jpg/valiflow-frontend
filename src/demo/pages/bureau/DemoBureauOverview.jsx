import React from 'react';
import BureauOverview from "@/pages/BureauDashboard/BureauOverview";
import { demoBureauMock } from "@/demo/demoBureauMock";

export default function DemoBureauOverview() {
    return (
        <BureauOverview demoMode={true} demoOverrideData={demoBureauMock.overview} />
    );
}
