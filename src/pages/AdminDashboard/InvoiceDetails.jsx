import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🧩 Dummy data – ersätt med API-respons
  const invoice = useMemo(() => {
    const all = [
      {
        id: "INV-3094",
        bureau: "EkonomiPartner AB",
        company: "FinTechify AB",
        amount: "12 430 kr",
        currency: "SEK",
        date: "2025-10-22",
        dueDate: "2025-11-21",
        risk: 7.8,
        status: "Flaggad", // Godkänd | Under granskning | Flaggad
        aiStatus: ["IBAN mismatch", "VAT check fail"],
        pdfUrl: "", // lägg in länk till PDF när du har den
        iban: "SE35 5000 0000 0583 9825 7466",
        org: "559101-5555",
        customerNo: "C-88412",
        reference: "PO-7731",
      },
      {
        id: "INV-3088",
        bureau: "FinVision AB",
        company: "Svea Tools AB",
        amount: "3 420 kr",
        currency: "SEK",
        date: "2025-10-20",
        dueDate: "2025-11-19",
        risk: 2.3,
        status: "Godkänd",
        aiStatus: ["OK"],
        pdfUrl: "",
        iban: "SE12 8000 0000 1234 5678 9012",
        org: "556882-1122",
        customerNo: "C-11337",
        reference: "PO-3321",
      },
    ];
    return all.find((i) => i.id === id?.replace("#", "")) || all[0];
  }, [id]);

  const [banner, setBanner] = useState(null);

  const riskPill =
    invoice.risk >= 7
      ? "bg-red-50 text-red-700"
      : invoice.risk >= 4
      ? "bg-yellow-50 text-yellow-700"
      : "bg-emerald-50 text-emerald-700";

  const statusPill =
    invoice.status === "Godkänd"
      ? "bg-emerald-50 text-emerald-700"
      : invoice.status === "Under granskning"
      ? "bg-yellow-50 text-yellow-700"
      : "bg-red-50 text-red-700";

  const timeline = [
    { t: "2025-10-22 09:41", label: "Faktura mottagen", type: "info" },
    { t: "2025-10-22 09:41", label: "AI-analys körd", type: "info" },
    ...(invoice.aiStatus[0] !== "OK"
      ? [{ t: "2025-10-22 09:42", label: `Flaggad: ${invoice.aiStatus.join(", ")}`, type: "warn" }]
      : []),
  ];

  const related = [
    { id: "INV-3091", amount: "9 980 kr", date: "2025-10-21", risk: 5.6, status: "Under granskning" },
    { id: "INV-3079", amount: "6 210 kr", date: "2025-10-18", risk: 7.1, status: "Flaggad" },
    { id: "INV-3063", amount: "2 990 kr", date: "2025-10-12", risk: 3.1, status: "Godkänd" },
  ];

  // ⚙️ Åtgärder – koppla till API senare
  const setForManualReview = () => {
    setBanner({ type: "warn", text: "Fakturan har satts i manuell granskning." });
    // PATCH /api/invoices/:id { status: "Under granskning" }
  };
  const markFalsePositive = () => {
    setBanner({ type: "ok", text: "Flaggningen har markerats som falsk positiv." });
    // POST /api/invoices/:id/false-positive
  };
  const confirmFraud = () => {
    setBanner({
      type: "danger",
      text: "Fakturan är markerad som bekräftat bedrägeri och kommer spärras.",
    });
    // POST /api/invoices/:id/confirm-fraud
  };
  const approveInvoice = () => {
    setBanner({ type: "ok", text: "Fakturan är godkänd." });
    // POST /api/invoices/:id/approve
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 hover:text-slate-800 text-sm"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Tillbaka till fakturor
      </button>

      {/* Header */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Faktura {invoice.id}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {invoice.company} • {invoice.bureau} • Org.nr {invoice.org}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className={`px-2 py-1 text-xs rounded-lg ${statusPill}`}>{invoice.status}</span>
              <span className={`px-2 py-1 text-xs rounded-lg ${riskPill}`}>Risk {invoice.risk.toFixed(1)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={setForManualReview}
              className="px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Sätt i granskning
            </button>
            <button
              onClick={markFalsePositive}
              className="px-3 py-2 text-sm bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200"
            >
              Falsk positiv
            </button>
            <button
              onClick={approveInvoice}
              className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Godkänn
            </button>
            <button
              onClick={confirmFraud}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Bekräfta bedrägeri
            </button>
          </div>
        </div>

        {/* Banner */}
        {banner && (
          <div
            className={`mt-4 text-sm rounded-lg px-3 py-2 border
            ${
              banner.type === "ok"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : banner.type === "warn"
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {banner.text}
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Meta label="Belopp" value={`${invoice.amount} ${invoice.currency}`} icon={DocumentTextIcon} />
          <Meta label="Datum" value={invoice.date} icon={DocumentTextIcon} />
          <Meta label="Förfallodatum" value={invoice.dueDate} icon={DocumentTextIcon} />
          <Meta label="Kundnr / Ref" value={`${invoice.customerNo} • ${invoice.reference}`} icon={DocumentTextIcon} />
          <Meta label="IBAN" value={invoice.iban} icon={DocumentTextIcon} />
          <Meta label="AI-status" value={invoice.aiStatus.join(", ")} icon={ShieldExclamationIcon} />
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PDF Preview */}
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-slate-800">PDF-förhandsvisning</h3>
            <a
              className="text-sm text-emerald-600 hover:text-emerald-800"
              href={invoice.pdfUrl || "#"}
              onClick={(e) => !invoice.pdfUrl && e.preventDefault()}
            >
              {invoice.pdfUrl ? "Öppna i ny flik" : "Ingen PDF angiven"}
            </a>
          </div>

          {invoice.pdfUrl ? (
            <iframe
              title="Invoice PDF"
              src={invoice.pdfUrl}
              className="w-full h-[620px] border rounded-lg"
            />
          ) : (
            <div className="h-[420px] border rounded-lg bg-gray-50 flex items-center justify-center text-slate-400 text-sm">
              PDF-preview placeholder (ange <code>pdfUrl</code> när den finns)
            </div>
          )}
        </div>

        {/* AI / Rules / Timeline */}
        <div className="space-y-6">
          <div className="bg-white border rounded-2xl shadow-sm p-4">
            <h3 className="font-medium text-slate-800 mb-2">AI-regelträffar</h3>
            {invoice.aiStatus[0] === "OK" ? (
              <p className="text-sm text-slate-500">Inga avvikelser upptäckta.</p>
            ) : (
              <ul className="space-y-2">
                {invoice.aiStatus.map((s, i) => (
                  <li key={i} className="text-sm px-3 py-2 border rounded-lg bg-yellow-50/60 text-yellow-800">
                    • {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-4">
            <h3 className="font-medium text-slate-800 mb-2">Händelser</h3>
            <ul className="space-y-2">
              {timeline.map((ev, i) => (
                <li
                  key={i}
                  className={`text-sm px-3 py-2 border rounded-lg ${
                    ev.type === "warn"
                      ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                      : "bg-gray-50 text-slate-700 border-gray-200"
                  }`}
                >
                  <span className="text-slate-400 mr-2">{ev.t}</span>
                  {ev.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-4">
            <h3 className="font-medium text-slate-800 mb-2">Relaterade fakturor</h3>
            <ul className="divide-y">
              {related.map((r) => (
                <li key={r.id} className="py-2 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium text-slate-800">#{r.id}</span>{" "}
                    <span className="text-slate-500">• {r.date} • {r.amount}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      r.risk >= 7
                        ? "bg-red-50 text-red-700"
                        : r.risk >= 4
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border rounded-2xl shadow-sm p-4">
            <h3 className="font-medium text-slate-800 mb-2">Snabbåtgärder</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionBtn onClick={setForManualReview} icon={ExclamationTriangleIcon} label="Sätt i granskning" variant="warn" />
              <ActionBtn onClick={markFalsePositive} icon={ShieldExclamationIcon} label="Falsk positiv" variant="neutral" />
              <ActionBtn onClick={approveInvoice} icon={CheckCircleIcon} label="Godkänn" variant="ok" />
              <ActionBtn onClick={confirmFraud} icon={ShieldExclamationIcon} label="Bekräfta bedrägeri" variant="danger" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value, icon: Icon }) {
  return (
    <div className="border rounded-xl p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-gray-100 text-slate-600 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800 break-all">{value}</p>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, icon: Icon, label, variant = "neutral" }) {
  const styles =
    variant === "ok"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : variant === "warn"
      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
      : variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-gray-100 hover:bg-gray-200 text-slate-700";
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${styles}`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}
