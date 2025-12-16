import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle, ShieldCheck, Building2, Sparkles } from "lucide-react";

const VF = {
  navy: "#0B2A63",
  blue: "#1E5CB3",
  bg: "#FFFFFF",
};

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    accountType: "",
    companyName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    metric: "",
    orgNumber: "",
    vatNumber: "",
    acceptTerms: false,
    marketingOptIn: true,
  });

  /* --------------------------- FORM LOGIC (unchanged) --------------------------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setAccountType = (type) => {
    setForm((prev) => ({ ...prev, accountType: type, role: "", metric: "" }));
    setErrors((prev) => ({ ...prev, accountType: undefined }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.accountType) newErrors.accountType = "Välj kontotyp.";
    if (!form.companyName.trim())
      newErrors.companyName = "Ange namn på byrå / företag.";
    if (!form.fullName.trim()) newErrors.fullName = "Ange ditt namn.";
    if (!form.email.trim()) newErrors.email = "Ange din arbetsmejl.";
    if (!form.password) newErrors.password = "Ange ett lösenord.";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Bekräfta ditt lösenord.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Lösenorden matchar inte.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep1()) {
      toast.error("Kolla igenom fälten innan du går vidare.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.role) newErrors.role = "Välj din roll.";
    if (!form.metric)
      newErrors.metric =
        form.accountType === "AGENCY"
          ? "Välj ungefär hur många kundbolag ni planerar att ansluta."
          : "Välj ungefär hur många fakturor ni hanterar.";
    if (!form.acceptTerms)
      newErrors.acceptTerms = "Du måste godkänna användarvillkoren.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return toast.error("Kolla igenom fälten.");

    setSubmitting(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
        name: form.fullName,
        companyName: form.companyName,
        companyType: form.accountType === "AGENCY" ? "AGENCY" : "CUSTOMER",
        role: form.role,
        invoicesPerMonth:
          form.accountType === "CUSTOMER" ? form.metric : undefined,
        plannedCustomers:
          form.accountType === "AGENCY" ? form.metric : undefined,
        orgNumber: form.orgNumber || null,
        vatNumber: form.vatNumber || null,
        marketingOptIn: form.marketingOptIn,
        acceptTerms: form.acceptTerms,
      };

      const res = await fetch(`${API}/api/auth/register-full`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || "Registreringen misslyckades");

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user)
        localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Konto skapat! 🎉 Vi sätter upp din arbetsyta.");
      navigate(data.redirect || "/dashboard");
    } catch (err) {
      toast.error(err.message || "Något gick fel vid registreringen.");
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------- LEFT PANEL (VERSION B) --------------------------- */

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">

      {/* LEFT PANEL — Premium Creative Version B */}
      <div
        className="hidden lg:flex w-1/2 flex-col px-12 py-10 text-white relative overflow-hidden"
        style={{ background: VF.navy }}
      >
        {/* glowing element */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/25 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* wave bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-blue-300/20 to-transparent opacity-70 rounded-t-[90px]" />

        {/* LOGO */}
        <img
          src="/valiflow-logo.svg"
          alt="Valiflow"
          className="h-10 w-auto relative z-10 mb-12"
        />

        {/* Main pitch */}
        <div className="mt-auto mb-auto relative z-10 max-w-lg">
          <h1 className="text-4xl font-semibold leading-tight mb-4">
            Bygg förtroende i varje <br /> faktura, betalning och process.
          </h1>

          <p className="text-sm text-blue-100/90 max-w-md leading-relaxed">
            Valiflow ger CFO:er, ekonomichefer och redovisningsbyråer ett
            trust layer ovanpå fakturahantering — med automatiska
            policykontroller, riskanalys och spårbarhet i realtid.
          </p>

          {/* value section */}
          <div className="mt-10 space-y-4">
            <ValueCard
              icon={<ShieldCheck className="h-5 w-5 text-white" />}
              title="Policy- & leverantörskontroller"
              desc="Automatisk validering av leverantör, referenser och betalningar."
            />
            <ValueCard
              icon={<Building2 className="h-5 w-5 text-white" />}
              title="Redo för revision"
              desc="Full spårbarhet, historik och dokumentation — audit-ready by default."
            />
            <ValueCard
              icon={<Sparkles className="h-5 w-5 text-white" />}
              title="Mindre manuellt arbete"
              desc="Standardiserade kontroller och processer minskar risk och arbetstid."
            />
          </div>

          {/* trust line */}
          <p className="mt-10 text-xs text-blue-100/80">
            Valiflow används av nordiska energi-, bygg- och tjänstebolag.
          </p>
        </div>
      </div>

      {/* --------------------------- RIGHT PANEL (unchanged logic) --------------------------- */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 bg-white">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-8">
          
          {/* STEPPER HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Steg {step} av 2
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                {step === 1 ? "Skapa ditt Valiflow-konto" : "Finslipa din profil"}
              </h2>
            </div>
            <div className="flex gap-1">
              <span
                className={`h-2 w-8 rounded-full ${
                  step === 1 ? "bg-[#1E5CB3]" : "bg-slate-200"
                }`}
              />
              <span
                className={`h-2 w-8 rounded-full ${
                  step === 2 ? "bg-[#1E5CB3]" : "bg-slate-200"
                }`}
              />
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
            className="space-y-5"
          >
            {step === 1 && (
              <>
                {/* Kontotyp */}
                <AccountTypeSelector
                  form={form}
                  setAccountType={setAccountType}
                  errors={errors}
                />

                {/* Företag */}
                <TextInput
                  label="Namn på byrå / företag"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Ex: Nordbyrån Ekonomi AB"
                  error={errors.companyName}
                />

                {/* Ditt namn */}
                <TextInput
                  label="Ditt namn"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Ex: Anna Svensson"
                  error={errors.fullName}
                />

                {/* Email */}
                <TextInput
                  label="Arbetsmejl"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="namn@företag.se"
                  error={errors.email}
                />

                {/* Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    label="Lösenord"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                  <TextInput
                    label="Bekräfta lösenord"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                  />
                </div>

                {/* Buttons */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-2 w-full bg-[#1E5CB3] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#174EA6] transition"
                >
                  Nästa steg
                </button>

                <button
                  type="button"
                  className="mt-3 w-full border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Registrera med BankID
                </button>

                <p className="mt-3 text-xs text-slate-500 text-center">
                  Har du redan ett konto?{" "}
                  <a
                    href="/login"
                    className="text-[#1E5CB3] font-medium hover:underline"
                  >
                    Logga in här
                  </a>
                </p>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <SelectInput
                  label="Din roll"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  error={errors.role}
                  options={
                    form.accountType === "AGENCY"
                      ? [
                          "Redovisningskonsult",
                          "Auktoriserad redovisningskonsult",
                          "Byråchef / Partner",
                          "Assistent",
                          "Annat",
                        ]
                      : [
                          "CFO",
                          "Ekonomiansvarig",
                          "VD / Ägare",
                          "Controller",
                          "Redovisningsekonom",
                          "Annat",
                        ]
                  }
                />

                {/* Metric */}
                <SelectInput
                  label={
                    form.accountType === "AGENCY"
                      ? "Hur många kundbolag ansluter ni?"
                      : "Hur många fakturor hanterar ni per månad?"
                  }
                  name="metric"
                  value={form.metric}
                  onChange={handleChange}
                  error={errors.metric}
                  options={
                    form.accountType === "AGENCY"
                      ? [
                          { value: "1-5", label: "1–5 kundbolag" },
                          { value: "5-20", label: "5–20 kundbolag" },
                          { value: "20-50", label: "20–50 kundbolag" },
                          { value: "50+", label: "50+ kundbolag" },
                        ]
                      : [
                          { value: "0-150", label: "0–150 fakturor / månad" },
                          { value: "150-500", label: "150–500 fakturor / månad" },
                          { value: "500-1000", label: "500–1 000 fakturor" },
                          { value: "1000+", label: "1 000+ fakturor / månad" },
                        ]
                  }
                />

                {/* Org + VAT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput
                    label="Organisationsnummer (valfritt)"
                    name="orgNumber"
                    value={form.orgNumber}
                    onChange={handleChange}
                    placeholder="559000-1234"
                  />
                  <TextInput
                    label="VAT-nummer (valfritt)"
                    name="vatNumber"
                    value={form.vatNumber}
                    onChange={handleChange}
                    placeholder="SE559000123401"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 mt-2">
                  <CheckboxInput
                    name="acceptTerms"
                    checked={form.acceptTerms}
                    onChange={handleChange}
                    error={errors.acceptTerms}
                    label={
                      <>
                        Jag godkänner{" "}
                        <a href="/terms" className="text-[#1E5CB3] underline">
                          användarvillkoren
                        </a>{" "}
                        och{" "}
                        <a
                          href="/privacy"
                          className="text-[#1E5CB3] underline"
                        >
                          personuppgiftspolicyn
                        </a>
                        .
                      </>
                    }
                  />

                  <CheckboxInput
                    name="marketingOptIn"
                    checked={form.marketingOptIn}
                    onChange={handleChange}
                    label="Jag vill få insikter, bästa praxis och produktuppdateringar."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 border border-slate-300 text-slate-700 py-2.5 rounded-lg text-sm hover:bg-slate-50"
                  >
                    Tillbaka
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-2/3 bg-[#1E5CB3] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#174EA6] disabled:bg-slate-500 transition"
                  >
                    {submitting ? "Skapar konto..." : "Skapa konto"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- SMALL REUSABLE COMPONENTS --------------------------- */

function ValueCard({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
      <div className="h-8 w-8 flex items-center justify-center bg-white/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-blue-100 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TextInput({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E5CB3]/20 focus:border-[#1E5CB3]"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function SelectInput({ label, error, options, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>
      <select
        {...props}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E5CB3]/20 focus:border-[#1E5CB3]"
      >
        <option value="">Välj</option>
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function CheckboxInput({ label, error, ...props }) {
  return (
    <div>
      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input {...props} type="checkbox" className="mt-0.5" />
        <span>{label}</span>
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function AccountTypeSelector({ form, setAccountType, errors }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-2">
        Vad vill du skapa konto som?
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setAccountType("AGENCY")}
          className={`border rounded-lg px-3 py-2 text-sm text-left ${
            form.accountType === "AGENCY"
              ? "border-[#1E5CB3] bg-[#1E5CB3]/5 text-[#1E5CB3] font-medium"
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Redovisningsbyrå
          <span className="block text-xs text-slate-500">
            Bjud in kunder & team
          </span>
        </button>
        <button
          type="button"
          onClick={() => setAccountType("CUSTOMER")}
          className={`border rounded-lg px-3 py-2 text-sm text-left ${
            form.accountType === "CUSTOMER"
              ? "border-[#1E5CB3] bg-[#1E5CB3]/5 text-[#1E5CB3] font-medium"
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Företag / kundbolag
          <span className="block text-xs text-slate-500">
            Hantera egna fakturor
          </span>
        </button>
      </div>
      {errors.accountType && (
        <p className="mt-1 text-xs text-red-600">{errors.accountType}</p>
      )}
    </div>
  );
}
