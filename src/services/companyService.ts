// src/services/companyService.ts
// ------------------------------------------------------------------
// 🏢 Valiflow Frontend Company Service v2.0
// Matchar backend CompanyRoutes + CompanySummaryRoutes exakt
// ------------------------------------------------------------------

import { api } from "./api";
import type { AxiosResponse } from "axios";

/* ------------------------------------------------------------------
   Typer baserat på backend Company + CompanySummary
-------------------------------------------------------------------*/

export interface CompanyUser {
  id: number;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export interface CompanyCustomer {
  id: number;
  name: string | null;
  customerId: string | null;
  orgNumber: string | null;
  email: string | null;
  phone: string | null;
}

export interface CompanyProfile {
  id: number;
  name: string;
  orgNumber: string | null;
  vatNumber: string | null;
  type: string | null;
  createdAt: string;

  users: CompanyUser[];
  customers: CompanyCustomer[];
}

export interface VidaReadiness {
  companyId: number;
  vidaReady: boolean;
  checklist: {
    vatNumber: boolean;
    organisationNumber: boolean;
    invoices: boolean;
    payments: boolean;
  };
}

/* ------------------------------------------------------------------
   Company Summary = AI sammanfattning (TrustEngine v4)
-------------------------------------------------------------------*/
export interface CompanyAISummary {
  companyId: number;
  summary: string;
  avgRisk: number | null;
  avgConfidence: number | null;
  totalInvoices: number;
  fraudLogs: number;
  aiVersion: string | null;
  trustScore: number | null;
  updatedAt: string;
}

/* ------------------------------------------------------------------
   Financial Summary
-------------------------------------------------------------------*/
export interface CompanyFinancialSummary {
  companyId: number;
  invoiceCount: number;
  totalAmountSEK: number;
  flaggedCount: number;
  avgTrust: number;
  safe: number;
  medium: number;
  risky: number;
  updatedAt: string;
}

/* ------------------------------------------------------------------
   GET /api/company/me
-------------------------------------------------------------------*/
export async function getMyCompany(): Promise<CompanyProfile> {
  const res: AxiosResponse<CompanyProfile> = await api.get("/company/me");
  return res.data;
}

/* ------------------------------------------------------------------
   PUT /api/company/me
-------------------------------------------------------------------*/
export interface UpdateCompanyPayload {
  name?: string;
  orgNumber?: string;
  vatNumber?: string;
}

export async function updateMyCompany(
  data: UpdateCompanyPayload
): Promise<CompanyProfile> {
  const res: AxiosResponse<CompanyProfile> = await api.put("/company/me", data);
  return res.data;
}

/* ------------------------------------------------------------------
   GET /api/company/:id  (full profil)
-------------------------------------------------------------------*/
export async function getCompanyById(
  companyId: number
): Promise<CompanyProfile> {
  const res: AxiosResponse<CompanyProfile> = await api.get(
    `/company/${companyId}`
  );
  return res.data;
}

/* ------------------------------------------------------------------
   GET /api/company/:id/vida-ready
-------------------------------------------------------------------*/
export async function getVidaReadiness(
  companyId: number
): Promise<VidaReadiness> {
  const res: AxiosResponse<VidaReadiness> = await api.get(
    `/company/${companyId}/vida-ready`
  );
  return res.data;
}

/* ------------------------------------------------------------------
   GET /api/company/:id/summary  (AI-sammanfattning)
-------------------------------------------------------------------*/
export async function getCompanySummary(
  companyId: number
): Promise<CompanyAISummary> {
  const res: AxiosResponse<CompanyAISummary> = await api.get(
    `/company/${companyId}/summary`
  );
  return res.data;
}

/* ------------------------------------------------------------------
   GET /api/company/:id/financial-summary
-------------------------------------------------------------------*/
export async function getFinancialSummary(
  companyId: number
): Promise<CompanyFinancialSummary> {
  const res: AxiosResponse<CompanyFinancialSummary> = await api.get(
    `/company/${companyId}/financial-summary`
  );
  return res.data;
}

/* ------------------------------------------------------------------
   GET /api/company/:id/users
-------------------------------------------------------------------*/
export async function getCompanyUsers(
  companyId: number
): Promise<CompanyUser[]> {
  const res: AxiosResponse<CompanyUser[]> = await api.get(
    `/company/${companyId}/users`
  );
  return res.data;
}

/* ------------------------------------------------------------------
   GET /api/company/:id/customers
-------------------------------------------------------------------*/
export async function getCompanyCustomers(
  companyId: number
): Promise<CompanyCustomer[]> {
  const res: AxiosResponse<CompanyCustomer[]> = await api.get(
    `/company/${companyId}/customers`
  );
  return res.data;
}
