import React from 'react';
import BureauCustomers from "@/pages/BureauDashboard/BureauCustomers";
import { demoBureauMock } from "@/demo/demoBureauMock";

export default function DemoBureauCustomers() {
    return (
        <BureauCustomers demoMode={true} demoOverrideData={demoBureauMock.customers} />
    );
}
