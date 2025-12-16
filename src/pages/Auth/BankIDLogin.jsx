import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * 🧠 Simulated BankID Login Page
 * Works with backend routes:
 *   POST /api/auth/bankid/start
 *   POST /api/auth/bankid/status
 */
export default function BankIDLogin() {
  const [orderRef, setOrderRef] = useState(null);
  const [qrStartSecret, setQrStartSecret] = useState(null);
  const [qrStartToken, setQrStartToken] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [hint, setHint] = useState(null);
  const [token, setToken] = useState(null);

  /**
   * 🔹 Step 1: Start BankID login
   */
  async function startBankIdLogin() {
    try {
      setStatus("starting...");
      toast.info("Starting BankID login...");

      const res = await fetch(`${API_URL}/api/auth/bankid/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalNumber: "199001011234" }), // sandbox user
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setOrderRef(data.orderRef);
      setQrStartSecret(data.qrStartSecret);
      setQrStartToken(data.qrStartToken);
      setStatus("pending...");
      toast.success("BankID order started — waiting for user confirmation...");
    } catch (err) {
      console.error("❌ startBankIdLogin error:", err);
      toast.error("Failed to start BankID login");
      setStatus("failed");
    }
  }

  /**
   * 🔁 Step 2: Poll BankID login status every 3 seconds
   */
  useEffect(() => {
    if (!orderRef) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/bankid/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderRef }),
        });
        const data = await res.json();

        console.log("BankID status:", data);

        if (data.status === "complete") {
          clearInterval(interval);
          setStatus("✅ Login complete");
          setToken(data.token);
          localStorage.setItem("token", data.token);
          toast.success("✅ BankID verified successfully!");
          setTimeout(() => (window.location.href = "/dashboard"), 1500);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setStatus("❌ Failed");
          toast.error(`BankID failed: ${data.hintCode || "unknown"}`);
        } else {
          setStatus("waiting... " + (data.hintCode || ""));
          setHint(data.hintCode);
        }
      } catch (err) {
        console.error("❌ poll error:", err);
        clearInterval(interval);
        setStatus("failed");
        toast.error("Polling error");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderRef]);

  /**
   * 🌀 Step 3: Refresh QR code every second (per BankID spec)
   */
  useEffect(() => {
    if (!qrStartSecret || !qrStartToken) return;

    const updateQR = () => {
      const time = Math.floor(Date.now() / 1000);
      const qrString = `${qrStartSecret}.${time}.${qrStartToken}`;
      setQrData(qrString);
    };

    updateQR();
    const interval = setInterval(updateQR, 1000);
    return () => clearInterval(interval);
  }, [qrStartSecret, qrStartToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">BankID Login (Sandbox)</h1>

        {status === "idle" && (
          <button
            onClick={startBankIdLogin}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md transition"
          >
            Log in with BankID
          </button>
        )}

        {status.startsWith("starting") && (
          <p className="text-gray-500">Connecting to BankID...</p>
        )}

        {status.startsWith("pending") && (
          <div className="flex flex-col items-center">
            {qrData && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <QRCode value={qrData} size={200} />
              </div>
            )}
            <p className="text-gray-700 font-medium mb-2">Waiting for BankID confirmation...</p>
            <p className="text-sm text-gray-500">Hint: {hint || "outstandingTransaction"}</p>
            <div className="mt-4 w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {status.includes("complete") && (
          <p className="text-green-600 font-semibold">✅ Verified successfully!</p>
        )}

        {status.includes("Failed") && (
          <p className="text-red-600 font-semibold">❌ Login failed. Please try again.</p>
        )}

        {token && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg text-sm text-left">
            <p className="font-semibold text-green-800">🎉 Logged in successfully!</p>
            <p className="text-gray-600 mt-1">JWT Token (preview):</p>
            <code className="block mt-1 text-xs break-all bg-white p-2 rounded">
              {token.slice(0, 60)}...
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
