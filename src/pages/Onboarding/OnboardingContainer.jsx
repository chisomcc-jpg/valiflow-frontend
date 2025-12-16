import React, { useState } from "react";
import StepSelectType from "./StepSelectType.jsx";
import StepAccountSetup from "./StepAccountSetup.jsx";
import StepGuideIntro from "./StepGuideIntro.jsx";
import StepDashboardGuide from "./StepDashboardGuide.jsx";
import OnboardingProgressBar from "./OnboardingProgressBar.jsx";

export default function OnboardingContainer() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState({});

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleUserType = (type) => {
    setUserType(type);
    nextStep();
  };

  const handleAccountData = (data) => {
    setUserData(data);
    nextStep();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <OnboardingProgressBar step={step} total={4} />

      {step === 1 && <StepSelectType onSelect={handleUserType} />}
      {step === 2 && <StepAccountSetup onSubmit={handleAccountData} />}
      {step === 3 && <StepGuideIntro onNext={nextStep} />}
      {step === 4 && <StepDashboardGuide userType={userType} />}
    </div>
  );
}
