// src/pages/Company.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";

/* ==========================================================
   🎨 Valiflow Theme
========================================================== */
const VF = {
  navy: "#0A1E44",
  blue: "#1E5CB3",
  bg: "#F4F7FB",
};

/* ==========================================================
   🏢 MAIN COMPONENT
========================================================== */
export default function Company() {
  const [activeTab, setActiveTab] = useState("profil");
  const [company, setCompany] = useState(null);
  const [team, setTeam] = useState([]);
  const [invites, setInvites] = useState([]);

  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingInvites, setLoadingInvites] = useState(true);

  const [error, setError] = useState(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("USER");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ----------------------------------------------------------
     🔄 Fetch: Mitt företag (/api/company/me)
  ---------------------------------------------------------- */
  useEffect(() => {
    if (!token) {
      setLoadingCompany(false);
      setError("Ingen token – du verkar inte vara inloggad.");
      return;
    }

    fetch(`${API}/api/company/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Kunde inte hämta företag.");
        return data;
      })
      .then((data) => {
        setCompany(data);
        setLoadingCompany(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching company:", err);
        setError(err.message);
        setLoadingCompany(false);
      });
  }, [API, token]);

  /* ----------------------------------------------------------
     🔄 Fetch: Teamet (/api/admin/users)
  ---------------------------------------------------------- */
  useEffect(() => {
    if (!token) {
      setLoadingTeam(false);
      return;
    }

    fetch(`${API}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Kunde inte hämta team.");
        return data;
      })
      .then((data) => {
        setTeam(data || []);
        setLoadingTeam(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching team:", err);
        setLoadingTeam(false);
      });
  }, [API, token]);

  /* ----------------------------------------------------------
     🔄 Fetch: Invites (/api/invites) – kräver GET-route i backend
  ---------------------------------------------------------- */
  useEffect(() => {
    if (!token) {
      setLoadingInvites(false);
      return;
    }

    fetch(`${API}/api/invites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Kunde inte hämta invites.");
        return data;
      })
      .then((data) => {
        setInvites(data || []);
        setLoadingInvites(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching invites:", err);
        setLoadingInvites(false);
      });
  }, [API, token]);

  const tabs = [
    { id: "profil", label: "Företagsprofil", icon: BuildingOfficeIcon },
    { id: "team", label: "Team & Åtkomst", icon: UserGroupIcon },
    { id: "finans", label: "Finansiella inställningar", icon: CurrencyDollarIcon },
  ];

  const handleCompanyUpdated = (updated) => {
    setCompany(updated);
  };

  const openInvite = () => {
    setInviteEmail("");
    setInviteRole("USER");
    setInviteError(null);
    setInviteSuccess(null);
    setInviteOpen(true);
  };

  const handleInviteSubmit = async () => {
    if (!inviteEmail) {
      setInviteError("Ange en e-postadress.");
      return;
    }
    setInviteLoading(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      const res = await fetch(`${API}/api/invites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Fel ${res.status}`);
      }

      setInviteSuccess("Inbjudan skapad och länk genererad.");
      if (data.invite) {
        setInvites((prev) => [data.invite, ...prev]);
      }
    } catch (err) {
      console.error("❌ Error creating invite:", err);
      setInviteError(err.message || "Något gick fel vid skapande av inbjudan.");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: VF.bg }}>
      {/* HEADER */}
      <header
        className="px-8 py-5 shadow text-white"
        style={{
          background: `linear-gradient(90deg, ${VF.navy} 0%, ${VF.blue} 100%)`,
        }}
      >
        <h1 className="text-xl font-semibold">
          {company?.name || "Mitt företag"}
        </h1>
        <p className="text-sm opacity-80">
          Hantera företagsinformation, användare och ekonomiska inställningar.
        </p>
        {company?.orgNumber && (
          <p className="text-xs opacity-60 mt-1">
            Org.nr: {company.orgNumber}{" "}
            {company.vatNumber ? `• VAT: ${company.vatNumber}` : ""}
          </p>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* TABS */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex bg-white border border-slate-200 rounded-xl shadow-sm p-1"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === id
                  ? "bg-[#1E5CB3] text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* CONTENT */}
        <div className="relative mt-6">
          <AnimatePresence mode="wait">
            {activeTab === "profil" && (
              <ProfileTab
                company={company}
                loading={loadingCompany}
                onUpdated={handleCompanyUpdated}
              />
            )}
            {activeTab === "team" && (
              <TeamTab
                team={team}
                loading={loadingTeam}
                invites={invites}
                loadingInvites={loadingInvites}
                onOpenInvite={openInvite}
              />
            )}
            {activeTab === "finans" && <FinanceTab />}
          </AnimatePresence>
        </div>
      </div>

      {/* INVITE MODAL */}
      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        email={inviteEmail}
        setEmail={setInviteEmail}
        role={inviteRole}
        setRole={setInviteRole}
        loading={inviteLoading}
        error={inviteError}
        success={inviteSuccess}
        onSubmit={handleInviteSubmit}
      />
    </div>
  );
}

/* ==========================================================
   🏢 PROFIL TAB
========================================================== */
function ProfileTab({ company, loading, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [name, setName] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  useEffect(() => {
    if (company) {
      setName(company.name || "");
      setOrgNumber(company.orgNumber || "");
      setVatNumber(company.vatNumber || "");
    }
  }, [company]);

  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setSaveError("Ingen token – du verkar inte vara inloggad.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/company/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          orgNumber: orgNumber || null,
          vatNumber: vatNumber || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Fel ${res.status}`);
      }

      if (onUpdated) onUpdated(data);
      setEditMode(false);
    } catch (err) {
      console.error("❌ Error saving company:", err);
      setSaveError(err.message || "Kunde inte spara företagsinformation.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setName(company.name || "");
      setOrgNumber(company.orgNumber || "");
      setVatNumber(company.vatNumber || "");
    }
    setSaveError(null);
    setEditMode(false);
  };

  return (
    <motion.div
      key="profil"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      <PremiumCard
        title="Företagsinformation"
        icon={<BuildingOfficeIcon className="w-5 h-5" />}
      >
        {loading ? (
          <p className="text-sm text-slate-500">Laddar företagsinformation...</p>
        ) : !company ? (
          <p className="text-sm text-slate-500">
            Ingen företagsinformation kunde hämtas.
          </p>
        ) : (
          <div className="space-y-4 text-sm text-slate-700">
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-md">
                {saveError}
              </div>
            )}

            {/* Namn */}
            {editMode ? (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Företagsnamn
                </label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1E5CB3]/20 focus:border-[#1E5CB3]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            ) : (
              <p>
                <strong>Företagsnamn:</strong> {company.name}
              </p>
            )}

            {/* Orgnummer */}
            {editMode ? (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Organisationsnummer
                </label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1E5CB3]/20 focus:border-[#1E5CB3]"
                  value={orgNumber}
                  onChange={(e) => setOrgNumber(e.target.value)}
                  placeholder="t.ex. 556123-4567"
                />
              </div>
            ) : (
              <p>
                <strong>Organisationsnummer:</strong>{" "}
                {company.orgNumber || "Inte angivet"}
              </p>
            )}

            {/* VAT */}
            {editMode ? (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Momsnummer (VAT)
                </label>
                <input
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1E5CB3]/20 focus:border-[#1E5CB3]"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  placeholder="t.ex. SE556123456701"
                />
              </div>
            ) : (
              <p>
                <strong>Momsnummer (VAT):</strong>{" "}
                {company.vatNumber || "Inte angivet"}
              </p>
            )}

            <p>
              <strong>Företagstyp:</strong> {company.type}
            </p>
            <p>
              <strong>Skapad:</strong>{" "}
              {new Date(company.createdAt).toLocaleDateString("sv-SE")}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {editMode ? (
                <>
                  <GlowButton
                    text={saving ? "Sparar..." : "Spara ändringar"}
                    disabled={saving}
                    onClick={handleSave}
                  />
                  <button
                    onClick={handleCancel}
                    className="text-sm text-slate-500 hover:underline"
                    type="button"
                  >
                    Avbryt
                  </button>
                </>
              ) : (
                <GlowButton
                  text="Redigera information"
                  onClick={() => setEditMode(true)}
                />
              )}
            </div>
          </div>
        )}
      </PremiumCard>

      <PremiumCard
        title="Varumärke"
        icon={<SwatchIcon className="w-5 h-5" />}
      >
        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex items-center gap-6">
            <img
              src="/valiflow-logo.png"
              alt="Företagslogotyp"
              className="w-20 h-20 object-contain border border-slate-200 rounded-lg shadow-sm"
            />
            <GlowButton text="Ladda upp logotyp" />
          </div>

          <label className="block text-sm font-medium text-slate-700 mt-3">
            Accentfärg
          </label>
          <input
            type="color"
            value="#1E5CB3"
            className="mt-1 w-12 h-8 border border-slate-300 rounded"
            disabled
          />
        </div>
      </PremiumCard>
    </motion.div>
  );
}

/* ==========================================================
   👥 TEAM TAB (med invites)
========================================================== */
function TeamTab({ team, loading, invites, loadingInvites, onOpenInvite }) {
  return (
    <motion.div
      key="team"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <PremiumCard
        title="Team och åtkomst"
        icon={<UserGroupIcon className="w-5 h-5" />}
      >
        <div className="text-sm text-slate-700 space-y-6">
          {/* Aktiva användare */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Användare
            </h3>
            {loading ? (
              <p className="text-sm text-slate-500 p-2">Laddar team...</p>
            ) : team.length === 0 ? (
              <p className="text-sm text-slate-500 p-2">
                Inga användare i teamet ännu.
              </p>
            ) : (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="p-2 text-left">Namn</th>
                    <th className="p-2 text-left">E-post</th>
                    <th className="p-2 text-left">Roll</th>
                    <th className="p-2 text-left">Skapad</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-slate-50">
                      <td className="p-2 font-medium">
                        {u.name || u.email}
                      </td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("sv-SE")
                          : "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pending invites */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Inbjudningar
            </h3>
            {loadingInvites ? (
              <p className="text-sm text-slate-500 p-2">
                Laddar inbjudningar...
              </p>
            ) : invites.length === 0 ? (
              <p className="text-sm text-slate-500 p-2">
                Inga aktiva inbjudningar.
              </p>
            ) : (
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600">
                    <th className="p-2 text-left">E-post</th>
                    <th className="p-2 text-left">Roll</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Gäller till</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((inv) => (
                    <tr key={inv.id} className="border-b hover:bg-slate-50">
                      <td className="p-2">{inv.email}</td>
                      <td className="p-2">{inv.role}</td>
                      <td className="p-2">
                        {inv.accepted ? "Accepterad" : "Inväntar svar"}
                      </td>
                      <td className="p-2">
                        {inv.expiresAt
                          ? new Date(inv.expiresAt).toLocaleDateString("sv-SE")
                          : "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pt-2">
            <GlowButton text="Bjud in medlem" onClick={onOpenInvite} />
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  );
}

/* ==========================================================
   💰 FINANCE TAB (placeholder)
========================================================== */
function FinanceTab() {
  return (
    <motion.div
      key="finans"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      <PremiumCard
        title="Finansiella inställningar"
        icon={<CurrencyDollarIcon className="w-5 h-5" />}
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Valuta" type="select" options={["SEK", "EUR", "USD"]} />
            <Input label="Räkenskapsår börjar" type="date" />
            <Input label="Fakturaprefix" placeholder="INV-" />
            <Input label="Standard moms (%)" type="number" placeholder="25" />
          </div>
          <GlowButton text="Spara ändringar" />
        </div>
      </PremiumCard>
    </motion.div>
  );
}

/* ==========================================================
   🎛 INVITE MODAL
========================================================== */
function InviteModal({
  open,
  onClose,
  email,
  setEmail,
  role,
  setRole,
  loading,
  error,
  success,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">
            Bjud in ny medlem
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-2 rounded-md">
              {success}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              E-postadress
            </label>
            <input
              type="email"
              placeholder="namn@företag.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1E5CB3]/20 focus:border-[#1E5CB3]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Roll
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1E5CB3]/20 focus:border-[#1E5CB3]"
            >
              <option value="USER">Medarbetare (USER)</option>
              <option value="COMPANY_ADMIN">
                Administratör (COMPANY_ADMIN)
              </option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Avbryt
          </button>
          <GlowButton
            text={loading ? "Skickar..." : "Skicka inbjudan"}
            onClick={onSubmit}
            disabled={loading}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ==========================================================
   🧩 SHARED UI COMPONENTS
========================================================== */
function PremiumCard({ title, icon, children }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-slate-200 rounded-xl shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
        <div className="p-2 bg-[#1E5CB3]/10 text-[#1E5CB3] rounded-lg">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function GlowButton({ text, onClick, disabled }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
        disabled
          ? "bg-slate-400 cursor-not-allowed"
          : "bg-[#1E5CB3] hover:bg-[#174EA6]"
      }`}
    >
      {text}
    </motion.button>
  );
}

function Input({ label, type = "text", placeholder, options }) {
  return (
    <div>
      <label className="block text-slate-600 text-sm font-medium mb-1">
        {label}
      </label>

      {type === "select" ? (
        <select className="w-full border border-slate-300 rounded-lg px-2 py-1.5">
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full border border-slate-300 rounded-lg px-2 py-1.5"
        />
      )}
    </div>
  );
}
