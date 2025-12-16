import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeftRight,
} from "lucide-react";

// 🎨 Valiflow färger
const VF = {
  navy: "#0B2A63",
  blue: "#1E5CB3",
  bg: "#FFFFFF",
};

export default function ValiflowLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, token, user, loading: authLoading } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* Redirect if already logged in */
  useEffect(() => {
    if (!authLoading && token && user) {
      let target = "/dashboard";
      if (user.role === "SUPER_ADMIN") target = "/admin";
      else if (
        user.role === "AGENCY_ADMIN" ||
        user.companyType === "AGENCY"
      )
        target = "/bureau";
      navigate(target, { replace: true });
    }
  }, [authLoading, token, user, navigate]);

  /* Email login */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { email, password };
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!res.data?.token) throw new Error("Ogiltiga uppgifter");

      const { token: jwtToken, user: loggedInUser, redirect } = res.data;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("role", loggedInUser?.role);

      if (loggedInUser?.companyId)
        localStorage.setItem("companyId", loggedInUser.companyId);

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
      await login(jwtToken);

      let target = redirect || "/dashboard";
      if (loggedInUser.role === "SUPER_ADMIN") target = "/admin";
      else if (loggedInUser.role === "AGENCY_ADMIN") target = "/bureau";

      navigate(target, { replace: true });
    } catch {
      setError("Inloggningen misslyckades. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  /* BankID login */
  const handleBankIdLogin = async () => {
    try {
      const personalNumber = prompt("Personnummer (YYYYMMDDXXXX):");
      if (!personalNumber) return;

      setLoading(true);

      const startRes = await axios.post(
        `${API_URL}/api/auth/bankid/start`,
        { personalNumber }
      );

      const { orderRef } = startRes.data;

      let verified = false;
      let attempts = 0;

      while (!verified && attempts < 60) {
        await new Promise((r) => setTimeout(r, 2000));

        const statusRes = await axios.post(
          `${API_URL}/api/auth/bankid/status`,
          { orderRef }
        );

        const { status, token: jwtToken, user: bankIdUser } = statusRes.data;

        if (status === "complete" && jwtToken) {
          await login(jwtToken);

          localStorage.setItem("token", jwtToken);
          localStorage.setItem("user", JSON.stringify(bankIdUser));
          localStorage.setItem("role", bankIdUser.role);

          const target =
            bankIdUser.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";

          navigate(target, { replace: true });
          verified = true;
        }
        attempts++;
      }

      if (!verified) setError("BankID tog för lång tid.");
    } catch {
      setError("BankID-inloggning misslyckades.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT SIDE — Blue + Creative Premium Pitch */}
      <div
        className="hidden lg:flex w-1/2 flex-col px-12 py-10 text-white relative overflow-hidden"
        style={{ background: VF.navy }}
      >
        {/* Subtle glow behind logo */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-400/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Abstract "finance wave" */}
        <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-t from-blue-300/15 to-transparent opacity-80 rounded-t-[80px]" />

        {/* LOGO */}
        <img
          src="/valiflow-logo.svg"
          alt="Valiflow"
          className="h-10 w-auto relative z-10"
        />

        {/* Hero pitch */}
        <div className="mt-auto mb-auto relative z-10 max-w-md">
          <h1 className="text-3xl font-semibold leading-snug mb-4">
            Tryggare fakturaflöden.
            <br />
            Mindre risk. Mer kontroll.
          </h1>

          <p className="text-sm text-blue-100/90 max-w-md">
            Valiflow ger CFO:er, ekonomiteam och redovisningsbyråer ett
            automatiserat trust layer — med kontroller, efterlevnad och
            spårbarhet före varje betalning.
          </p>

          {/* Value bullets */}
          <div className="mt-8 space-y-3">
            <ValueBullet text="Minskar felbetalningar och avvikelser" />
            <ValueBullet text="Automatiska policy- och leverantörskontroller" />
            <ValueBullet text="Full spårbarhet och revisionssäker historik" />
          </div>

          {/* Trust statement */}
          <p className="mt-10 text-xs text-blue-100/80 opacity-90">
            Används av nordiska bolag inom bygg, energi och tjänster.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — Clean white login */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 bg-white">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-lg px-8 py-8">

          <div className="mt-1">
            <h1 className="text-xl font-semibold text-slate-900">
              Logga in på Valiflow
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Säkert inlogg till din Valiflow-miljö.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <InputField
              label="Arbetsmejl"
              icon={<Mail className="h-5 w-5 text-slate-400" />}
              type="email"
              placeholder="namn@företag.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordField
              label="Lösenord"
              value={password}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#1E5CB3]"
                />
                Kom ihåg mig
              </label>

              <button className="text-sm font-medium text-[#1E5CB3] hover:underline">
                Glömt lösenord?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-[#1E5CB3] text-white py-3 text-sm font-medium hover:bg-[#174EA6] transition"
            >
              {loading ? "Loggar in…" : "Logga in"}
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* BankID */}
            <button
              type="button"
              onClick={handleBankIdLogin}
              className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeftRight className="h-4 w-4" />
              Logga in med BankID
            </button>

            {/* Error */}
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Intresserad?{" "}
            <a
              href="/pilot"
              className="font-medium text-[#1E5CB3] hover:underline"
            >
              Ansök om byråpilot
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Reusable Components */

function InputField({ label, icon, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-700">{label}</label>
      <div className="flex items-center rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#1E5CB3]/30">
        <div className="pl-3">{icon}</div>
        <input
          {...props}
          className="w-full rounded-xl border-0 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
        />
      </div>
    </div>
  );
}

function PasswordField({ label, value, showPassword, setShowPassword, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-slate-700">{label}</label>
      <div className="relative flex items-center rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-[#1E5CB3]/30">
        <Lock className="h-5 w-5 text-slate-400 ml-3" />
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="w-full px-3 py-3 text-sm bg-transparent outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 p-2 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}

function ValueBullet({ text }) {
  return (
    <div className="flex items-center gap-2 text-blue-100/90 text-sm">
      <CheckCircle className="h-4 w-4 text-emerald-300" />
      <span>{text}</span>
    </div>
  );
}

function BenefitItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="h-7 w-7 flex items-center justify-center bg-white/10 rounded-lg text-white">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-blue-100">{desc}</p>
      </div>
    </div>
  );
}
