// src/components/useOnboardingTour.ts

import { useState } from "react";

export function useOnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const steps = [
    {
      id: "step1",
      targetId: "integration-btn",
      title: "Koppla integration",
      description: "Anslut Fortnox eller Visma för att börja analysera fakturor automatiskt.",
      position: "bottom",
    },
    {
      id: "step2",
      targetId: "sync-data-btn",
      title: "Synka data",
      description: "Tryck här för att hämta de senaste fakturorna från din integration.",
      position: "bottom",
    },
    {
      id: "step3",
      targetId: "ai-analysis-section",
      title: "AI-analys",
      description: "Här ser du resultatet av Valiflows automatiska fakturagranskning.",
      position: "top",
    },
    {
      id: "step4",
      targetId: "invite-btn",
      title: "Bjud in kollegor",
      description: "Bjud in ditt team för att samarbeta i Valiflow.",
      position: "left",
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsActive(false);
    }
  };

  return { steps, currentStep, nextStep, isActive };
}
