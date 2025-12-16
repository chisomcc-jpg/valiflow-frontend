import React from "react";
import { toast } from "sonner";

export default function VerifyBankID() {
  const handleVerify = () => {
    toast.info("BankID verification coming soon — simulated success ✅");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Verify your identity
        </h2>
        <p className="text-gray-500 mb-6">
          To connect financial services like Fortnox or Skatteverket, please verify your identity with BankID.
        </p>
        <button
          onClick={handleVerify}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Verify with BankID
        </button>
      </div>
    </div>
  );
}
