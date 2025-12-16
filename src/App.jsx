// src/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { initAnalytics, trackEvent } from "./lib/analytics";

// 🌍 Public pages
import Home from "./pages/Home.jsx";
import Product from "./pages/Product.jsx";
import PricingPage from "./pages/Pricing.jsx";
import FAQPage from "./pages/FAQ.jsx";
import CompliancePage from "./pages/CompliancePage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";

// ⭐ NEW marketing pages
import Solutions from "./pages/Solutions.jsx";
import AdminPilotApplications from "./pages/AdminPilotApplications.jsx";
import About from "./pages/About.jsx";
import SecurityPage from "./pages/Security.jsx";
import HowItWorksPage from "./pages/HowItWorks.jsx";
import TrustEngine from "./pages/TrustEngine.jsx";
import Legal from "./pages/Legal.jsx";

// 🔐 Auth pages
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyBankID from "./pages/VerifyBankID.jsx";
import BankIDLogin from "./pages/Auth/BankIDLogin.jsx";
import AcceptInvitePage from "./pages/Auth/AcceptInvitePage.jsx";

// 🔒 Protected routes
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { ROLES } from "./constants/roles";

// 🚫 System pages
import NotFound from "./pages/NotFound.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

import { setupAxios } from "./utils/axiosSetup";
setupAxios();
if (import.meta.env.DEV) console.log("Axios initialized in App.jsx ✅");

/* --------------------------------------------
   ⚙️ Lazy-loaded dashboards (CFA / Admin / Byrå)
---------------------------------------------*/
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/Overview.jsx"));


// 🧾 Fakturalista
const Invoices = lazy(() =>
  import("./pages/Dashboard/invoices/Invoices.jsx")
);

// 🧾 Fakturadetaljer (RÄTT SÖKVÄG)
const InvoiceDetails = lazy(() =>
  import("./pages/Dashboard/invoices/InvoiceDetails.jsx")
);

// 🧾 Fakturaspecifik AI & Audit-sida
const InvoiceAuditPage = lazy(() =>
  import("./pages/Dashboard/InvoiceAuditPage.jsx")
);

// 🤖 AI Assistant
const AIAssistant = lazy(() => import("./pages/Dashboard/AIAssistant.jsx"));

// Övriga Dashboard-sidor
const Email = lazy(() => import("./pages/Dashboard/Email.jsx"));
const EmailInbox = lazy(() => import("./pages/Dashboard/EmailInbox.jsx"));

const FraudOverview = lazy(() => import("./pages/Dashboard/FraudOverview.jsx"));
const FraudLogs = lazy(() => import("./pages/Dashboard/FraudLogs.jsx"));
const Settings = lazy(() => import("./pages/Dashboard/Settings.jsx"));
const Analytics = lazy(() => import("./pages/Dashboard/Analytics.jsx"));
const Integrations = lazy(() => import("@/pages/Dashboard/Integrations"));
const Suppliers = lazy(() => import("@/pages/Dashboard/Suppliers"));
const Company = lazy(() => import("@/pages/Dashboard/CompanySettings"));
const AuditLog = lazy(() => import("./pages/Dashboard/AuditLog.jsx"));
const DashboardSupport = lazy(() => import("./pages/Dashboard/Support.jsx"));

/* --------------------------------------------
   🛡️ Admin dashboard
---------------------------------------------*/
// 🛡️ Admin dashboard
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));
const Overview = lazy(() => import("./pages/AdminDashboard/Overview.jsx"));
const SystemHealth = lazy(() => import("./pages/AdminDashboard/Overview.jsx")); // Re-use Overview OR create specific if needed later. For now pointing to Overview is acceptable as Health is in Kpis
// Better: actually implementing the specific pages I created
const UsageCost = lazy(() => import("./pages/AdminDashboard/UsageCost.jsx"));
const CustomersRevenue = lazy(() => import("./pages/AdminDashboard/CustomersRevenue.jsx"));
const TrustEngineAdmin = lazy(() => import("./pages/AdminDashboard/TrustEngine.jsx"));
const IncidentsSupport = lazy(() => import("./pages/AdminDashboard/IncidentsSupport.jsx"));
const FeaturesExperiments = lazy(() => import("./pages/AdminDashboard/FeaturesExperiments.jsx"));
const Clients = lazy(() => import("./pages/AdminDashboard/Clients.jsx"));
const FirmClientDetails = lazy(() => import("./pages/AdminDashboard/FirmClientDetails.jsx"));
const GrowthAnalytics = lazy(() => import("./pages/AdminDashboard/Growth.jsx")); // NEW Growth Page

/* --------------------------------------------
   🧮 Byrå dashboard
---------------------------------------------*/
const BureauLayout = lazy(() => import("./layouts/BureauLayout.jsx"));
const BureauOverview = lazy(() =>
  import("./pages/BureauDashboard/BureauOverview.jsx")
);
const ExceptionRadar = lazy(() =>
  import("./pages/BureauDashboard/ExceptionRadar.jsx")
);
const BureauCustomers = lazy(() =>
  import("./pages/BureauDashboard/BureauCustomers.jsx")
);
const BureauInsights = lazy(() =>
  import("./pages/BureauDashboard/BureauInsights.jsx")
);
const BureauTeam = lazy(() => import("./pages/BureauDashboard/BureauTeam.jsx"));
const BureauNotifications = lazy(() =>
  import("./pages/BureauDashboard/BureauNotifications.jsx")
);
const BureauReports = lazy(() =>
  import("./pages/BureauDashboard/BureauReports.jsx")
);
const BureauSettings = lazy(() =>
  import("./pages/BureauDashboard/BureauSettings.jsx")
);
const BureauRiskcenter = lazy(() => import("./pages/BureauDashboard/BureauRiskcenter.jsx"));
const BureauSuppliers = lazy(() => import("./pages/BureauDashboard/BureauSuppliers.jsx"));
const BureauCompliance = lazy(() => import("./pages/BureauDashboard/BureauCompliance.jsx"));
const BureauAutomations = lazy(() => import("./pages/BureauDashboard/BureauAutomations.jsx"));

/* --------------------------------------------
   🚀 Demo Mode (Isolated)
---------------------------------------------*/
const DemoLayout = lazy(() => import("./demo/layouts/DemoLayout.jsx"));

// Company Demo Pages
const DemoCompanyOverview = lazy(() => import("./demo/pages/company/DemoCompanyOverview.jsx"));
const DemoCompanyInvoices = lazy(() => import("./demo/pages/company/DemoCompanyInvoices.jsx"));
const DemoCompanyRisk = lazy(() => import("./demo/pages/company/DemoCompanyRisk.jsx"));
const DemoCompanyAuditLog = lazy(() => import("./demo/pages/company/DemoCompanyAuditLog.jsx"));

// Bureau Demo Pages
const DemoBureauOverview = lazy(() => import("./demo/pages/bureau/DemoBureauOverview.jsx"));
const DemoBureauCustomers = lazy(() => import("./demo/pages/bureau/DemoBureauCustomers.jsx"));
const DemoBureauRisk = lazy(() => import("./demo/pages/bureau/DemoBureauRisk.jsx"));
const DemoBureauTeam = lazy(() => import("./demo/pages/bureau/DemoBureauTeam.jsx"));

// Cinematic Demo
const DemoStory = lazy(() => import("./demo/story/StoryDirector.jsx"));
const PilotSignup = lazy(() => import("./pages/PilotSignup.jsx"));

// 🌟 Marketing Pages
const MarketingBureauOverview = lazy(() => import("./pages/Marketing/MarketingBureauOverview.jsx"));
const MarketingBureauCustomers = lazy(() => import("./pages/Marketing/MarketingBureauCustomers.jsx"));
const MarketingBureauInsights = lazy(() => import("./pages/Marketing/MarketingBureauInsights.jsx"));

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // 1. Initialize Analytics (Heartbeat, Session)
    initAnalytics();
  }, []);

  useEffect(() => {
    // 2. Track Page View on Route Change
    trackEvent('page_view');
  }, [location]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* 🚀 Demo Routes */}
          <Route path="/demo" element={<DemoLayout />}>
            <Route index element={<Navigate to="company/overview" replace />} />

            {/* Company View */}
            <Route path="company/overview" element={<DemoCompanyOverview />} />
            <Route path="company/invoices" element={<DemoCompanyInvoices />} />
            <Route path="company/risk" element={<DemoCompanyRisk />} />
            <Route path="company/audit-log" element={<DemoCompanyAuditLog />} />

            {/* Bureau View */}
            <Route path="bureau/overview" element={<DemoBureauOverview />} />
            <Route path="bureau/customers" element={<DemoBureauCustomers />} />
            <Route path="bureau/risk" element={<DemoBureauRisk />} />
            <Route path="bureau/team" element={<DemoBureauTeam />} />
          </Route>

          {/* 🎬 Cinematic Demo (Standalone) */}
          <Route path="/demo/story" element={<DemoStory />} />

          {/* 🌍 Public Website Pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/compliance" element={<CompliancePage />} />

            {/* ⭐ NEW marketing pages */}
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/about" element={<About />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/trust-engine" element={<TrustEngine />} />
            <Route path="/legal" element={<Legal />} />
          </Route>

          {/* 🔐 Auth pages */}
          <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Navigate to="/pilot" replace />} />
          <Route path="/pilot" element={<PilotSignup />} />
          <Route path="/verify-bankid" element={<VerifyBankID />} />
          <Route path="/bankid-login" element={<BankIDLogin />} />

          {/* 🧭 CFA Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'OPERATOR', 'VIEWER', 'AGENCY_ADMIN', 'COMPANY_ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* 🛡️ RESTRICTED COMPONENT: Owner + Operator (+ Agency) */}
            <Route path="suppliers" element={<ProtectedRoute allowedRoles={['OWNER', 'OPERATOR', 'AGENCY_ADMIN']}><Suppliers /></ProtectedRoute>} />
            <Route path="invoices" element={<ProtectedRoute allowedRoles={['OWNER', 'OPERATOR', 'AGENCY_ADMIN']}><Invoices /></ProtectedRoute>} />
            <Route path="invoices/:id" element={<ProtectedRoute allowedRoles={['OWNER', 'OPERATOR', 'AGENCY_ADMIN']}><InvoiceDetails /></ProtectedRoute>} />
            <Route path="invoices/:id/audit" element={<ProtectedRoute allowedRoles={['OWNER', 'OPERATOR', 'AGENCY_ADMIN']}><InvoiceAuditPage /></ProtectedRoute>} />

            <Route path="ai" element={<AIAssistant />} />

            <Route path="email-inbox" element={<ProtectedRoute allowedRoles={['OWNER', 'OPERATOR', 'AGENCY_ADMIN']}><EmailInbox /></ProtectedRoute>} />
            <Route path="email" element={<Email />} />

            <Route path="fraud" element={<ProtectedRoute allowedRoles={['OWNER', 'OPERATOR', 'AGENCY_ADMIN']}><FraudOverview /></ProtectedRoute>} />
            <Route path="fraud-logs" element={<FraudLogs />} />

            <Route path="analytics" element={<Analytics />} />
            <Route path="audit-log" element={<AuditLog />} />

            {/* 🔒 LOCKED: Owner Only */}
            <Route path="integrations" element={<ProtectedRoute allowedRoles={['OWNER', 'AGENCY_ADMIN']}><Integrations /></ProtectedRoute>} />
            <Route path="company" element={<ProtectedRoute allowedRoles={['OWNER', 'AGENCY_ADMIN']}><Company /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute allowedRoles={['OWNER', 'AGENCY_ADMIN']}><Settings /></ProtectedRoute>} />
            <Route path="support" element={<DashboardSupport />} />
          </Route>

          {/* 🕵️‍♂️ Bureau Impersonation (Nested) */}
          <Route
            path="/dashboard/c/:companyId"
            element={
              <ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER', 'OPERATOR', 'VIEWER', 'COMPANY_ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="suppliers" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER', 'OPERATOR']}><Suppliers /></ProtectedRoute>} />
            <Route path="invoices" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER', 'OPERATOR']}><Invoices /></ProtectedRoute>} />
            <Route path="invoices/:id" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER', 'OPERATOR']}><InvoiceDetails /></ProtectedRoute>} />
            <Route path="invoices/:id/audit" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER', 'OPERATOR']}><InvoiceAuditPage /></ProtectedRoute>} />

            <Route path="email-inbox" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER', 'OPERATOR']}><EmailInbox /></ProtectedRoute>} />
            <Route path="email" element={<Email />} />
            <Route path="fraud" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER', 'OPERATOR']}><FraudOverview /></ProtectedRoute>} />
            <Route path="fraud-logs" element={<FraudLogs />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="audit-log" element={<AuditLog />} />

            {/* Impersonation Settings Access: Mostly Yes for Agency */}
            <Route path="integrations" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER']}><Integrations /></ProtectedRoute>} />
            <Route path="company" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER']}><Company /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute allowedRoles={['AGENCY_ADMIN', 'OWNER']}><Settings /></ProtectedRoute>} />
          </Route>

          {/* 🛡️ Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="health" element={<Overview />} /> {/* Reuse Overview for Health for now as Kpis are there */}
            <Route path="usage-cost" element={<UsageCost />} />
            <Route path="customers-revenue" element={<CustomersRevenue />} />
            <Route path="trust" element={<TrustEngineAdmin />} />
            <Route path="incidents" element={<IncidentsSupport />} />
            <Route path="features" element={<FeaturesExperiments />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<FirmClientDetails />} />
            {/* 🆕 Growth Analytics */}
            <Route path="growth" element={<GrowthAnalytics />} />
            {/* 🚀 Pilot Applications */}
            <Route path="pilot" element={<AdminPilotApplications />} />
          </Route>

          {/* 🧮 Byrå Dashboard */}
          <Route
            path="/bureau"
            element={
              <ProtectedRoute>
                <BureauLayout />
              </ProtectedRoute>
            }
          >
            {/* Bureau Routes Restricted by Role */}
            <Route index element={<BureauOverview />} />
            <Route path="radar" element={<ExceptionRadar />} />
            <Route path="customers" element={<BureauCustomers />} />

            {/* HIDE-ONLY (Not hard-blocked for Consultants, but limited view) */}
            <Route path="risk" element={<BureauRiskcenter />} />
            <Route path="suppliers" element={<BureauSuppliers />} />
            <Route path="notifications" element={<BureauNotifications />} />
            <Route path="reports" element={<BureauReports />} />

            {/* BLOCK: Owner/Manager Only */}
            <Route
              path="insights"
              element={
                <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}>
                  <BureauInsights />
                </ProtectedRoute>
              }
            />
            <Route
              path="team"
              element={
                <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}>
                  <BureauTeam />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}>
                  <BureauSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="compliance"
              element={
                <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}>
                  <BureauCompliance />
                </ProtectedRoute>
              }
            />
            <Route
              path="automations"
              element={
                <ProtectedRoute allowedRoles={[ROLES.OWNER, ROLES.MANAGER]}>
                  <BureauAutomations />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 🌟 Marketing Demo Pages (Static / No-Auth for screenshots) */}
          <Route path="/marketing" element={<BureauLayout demoMode={true} />}>
            <Route path="bureau-overview" element={<MarketingBureauOverview />} />
            <Route path="bureau-customers" element={<MarketingBureauCustomers />} />
            <Route path="bureau-insights" element={<MarketingBureauInsights />} />
          </Route>

          {/* 🚫 System pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
