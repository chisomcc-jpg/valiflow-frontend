
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

const STEPS = [
    /* 🟦 STEP 1 — OVERVIEW */
    {
        id: "overview-1",
        route: "/bureau/overview",
        title: "Valiflow tar ansvar innan problem uppstår",
        body: "Som redovisningsbyrå förväntas du idag:\n\n• hantera fler fakturor\n• upptäcka fler avvikelser\n• ta större ansvar vid fel\n\nValiflow fungerar som ett operativt skyddslager som filtrerar det normala och lyfter det som kräver mänsklig bedömning.",
        cta: "Nästa",
        placement: "center"
    },
    {
        id: "overview-2",
        route: "/bureau/overview",
        title: "Automatisering utan att tumma på ansvar",
        body: "Här ser du vad som har:\n\n• godkänts automatiskt\n• stoppats före bokföring\n• bedömts som säkert\n\nDetta är arbete som annars hade krävt manuell granskning.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="impact-cards"]',
        placement: "bottom"
    },
    {
        id: "overview-3",
        route: "/bureau/overview",
        title: "Vad som hade hänt utan Valiflow",
        body: "Utan ett aktivt kontrollager hade:\n\n• avvikande fakturor kunnat bokföras\n• risker upptäckts först i efterhand\n• byrån saknat samlad överblick\n\nDet är här många byråer idag tappar kontroll när volymer och regelkrav ökar.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="contrast-block"]',
        placement: "top",
        nextRoute: "/bureau/customers"
    },

    /* 🟦 STEP 2 — CUSTOMERS */
    {
        id: "customers-1",
        route: "/bureau/customers",
        title: "En byrå arbetar inte med kunder – utan med riskprofiler",
        body: "När kundportföljen växer räcker det inte längre att “ha koll”. Du behöver veta:\n\n• vilka kunder som avviker\n• vilka risker som ökar\n• var din tid gör mest nytta\n\nValiflow ger dig en prioriterad portföljvy.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="customers-header"]',
        placement: "bottom"
    },
    {
        id: "customers-2",
        route: "/bureau/customers",
        title: "Detta är byråns lägesbild just nu",
        body: "Systemet sammanfattar automatiskt:\n\n• kunder med förhöjd risk\n• nya avvikande mönster\n• känsliga förändringar, som betaluppgifter\n\nAvgörande i en tid med ökande fakturabedrägerier och högre tillsyn.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="customers-ai-summary"]',
        placement: "bottom"
    },
    {
        id: "customers-3",
        route: "/bureau/customers",
        title: "Fokusera där risken ökar – inte där allt är stabilt",
        body: "Risknivå, trend och avvikelser visas per kund.\nDet gör det enkelt att visa i efterhand varför åtgärder vidtogs – eller inte.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="customer-row-high-risk"]',
        placement: "top",
        nextRoute: "/bureau/risk"
    },

    /* 🟦 STEP 3 — RISK & AVVIKELSER */
    {
        id: "risk-1",
        route: "/bureau/risk",
        title: "Risker som fångas innan bokföring",
        body: "De mest kostsamma felen upptäcks ofta för sent.\nHär ser du risker som Valiflow redan har fångat – innan de blev ett problem.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="risk-header"]',
        placement: "bottom"
    },
    {
        id: "risk-2",
        route: "/bureau/risk",
        title: "Systemet ingriper – du beslutar",
        body: "Valiflow stoppar avvikelser, identifierar mönster och bevakar portföljen.\nDu behöver bara ta ställning där mänsklig bedömning krävs.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="risk-kpis"]',
        placement: "bottom"
    },
    {
        id: "risk-3",
        route: "/bureau/risk",
        title: "Varför detta är avgörande för byråansvar",
        body: "Vid revision eller myndighetsgranskning är frågan alltid:\n“Hur kunde detta ske?”\n\nValiflow gör att svaret blir:\n“Det fångades, bedömdes och dokumenterades.”",
        cta: "Nästa",
        targetSelector: '[data-demo-target="risk-trust-trigger"]',
        placement: "top"
    },
    {
        id: "risk-4",
        route: "/bureau/risk",
        title: "Varje risk är kopplad till ett beslut",
        body: "Varje rad visar:\n\n• varför något flaggats\n• risknivå\n• när det upptäcktes\n• vem som ska granska\n\nInget lämnas åt tolkning i efterhand.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="risk-table"]',
        placement: "top",
        nextRoute: "/bureau/team"
    },

    /* 🟦 STEP 4 — TEAM & AKTIVITET */
    {
        id: "team-1",
        route: "/bureau/team",
        title: "Kontroll över vem som gör vad – och varför",
        body: "När kraven på spårbarhet ökar räcker det inte att lita på processer.\nDu måste kunna visa vem som gjort vad, för vilken kund och med vilken behörighet.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="team-header"]',
        placement: "bottom"
    },
    {
        id: "team-2",
        route: "/bureau/team",
        title: "Alla åtgärder utförs av identifierade användare",
        body: "Varje användare har tydlig roll, status och historik.\nDet skyddar både byrån och individen.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="team-table"]',
        placement: "top",
        nextRoute: "/bureau/team?tab=roles"
    },
    {
        id: "team-3",
        route: "/bureau/team",
        title: "Roller begränsar risk – inte effektivitet",
        body: "Genom tydliga roller minskar risken för fel, ansvar blir tydligt och revision förenklas.\nExtra viktigt i takt med nya regelverk som CSRD.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="roles-view"]',
        placement: "top",
        nextRoute: "/bureau/team?tab=audit"
    },
    {
        id: "team-4",
        route: "/bureau/team",
        title: "Allt loggas. Allt kan visas i efterhand.",
        body: "Här syns godkända åtgärder, misslyckade inloggningar och förändringar.\nDetta är ofta det första revisorer och myndigheter efterfrågar.",
        cta: "Nästa",
        targetSelector: '[data-demo-target="audit-log"]',
        placement: "top"
    },

    /* 🟦 STEP 5 — FINAL DEMO STEP (MANDATORY) */
    {
        id: "closing",
        route: "/bureau/team", // Stay on team page
        title: "Redo för nästa steg",
        body: "Valiflow är byggt för:\n\n• ökande fakturavolymer\n• ökande bedrägeriförsök\n• ökade krav på spårbarhet, CSRD och ansvar\n\nDetta är inte ett verktyg –\ndet är ett kontrollager för framtidens redovisningsbyrå.",
        cta: "Skapa riktigt konto",
        secondaryCta: "Avsluta demo",
        placement: "center",
        isFinal: true
    }
];

export default function DemoWalkthrough() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentStepIndex, setCurrentStepIndex] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const [overlayStyle, setOverlayStyle] = useState(null);
    const [manuallyClosed, setManuallyClosed] = useState(false);

    // Trigger demo mode persistence
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const isExplicitDemo = params.get("demo") === "true";
        const isDemoRoute = location.pathname.includes("/demo/bureau");
        const isDismissed = sessionStorage.getItem("demo_dismissed") === "true";

        if (isExplicitDemo) {
            // User explicitly requested demo (e.g. clicked "Starta Guide")
            sessionStorage.removeItem("demo_dismissed"); // Reset dismissal
            setIsVisible(true);
            setManuallyClosed(false);
            if (currentStepIndex === null) setCurrentStepIndex(0);
        } else if (isDemoRoute && !isDismissed && !manuallyClosed) {
            // Auto-start if not dismissed
            setIsVisible(true);
            if (currentStepIndex === null) setCurrentStepIndex(0);
        } else {
            // Should be hidden
            setIsVisible(false);
        }
    }, [location.search, location.pathname, currentStepIndex, manuallyClosed]);

    const goToNextStep = () => {
        const nextIndex = currentStepIndex + 1;
        const isIsolatedDemo = location.pathname.startsWith("/demo");
        const prefix = isIsolatedDemo ? "/demo" : "";

        if (nextIndex < STEPS.length) {
            const nextStep = STEPS[currentStepIndex];
            if (nextStep.nextRoute) {
                let targetPath = nextStep.nextRoute;
                if (isIsolatedDemo && !targetPath.startsWith("/demo")) {
                    targetPath = prefix + targetPath;
                }
                navigate(targetPath + (targetPath.includes("?") ? "&" : "?") + "demo=true");
            }
            setCurrentStepIndex(nextIndex);
        } else {
            // End of demo
            setIsVisible(false);
            setManuallyClosed(true);
            sessionStorage.setItem("demo_dismissed", "true"); // Persist dismissal
            setCurrentStepIndex(0);

            // Remove demo param
            const newSearch = new URLSearchParams(location.search);
            newSearch.delete("demo");
            navigate({
                pathname: isIsolatedDemo ? "/demo/bureau/overview" : "/bureau/overview",
                search: newSearch.toString()
            });
        }
    };

    const dismissGuide = () => {
        setIsVisible(false);
        setManuallyClosed(true);
        sessionStorage.setItem("demo_dismissed", "true");

        const newSearch = new URLSearchParams(location.search);
        newSearch.delete("demo");

        const isIsolatedDemo = location.pathname.startsWith("/demo");
        navigate({
            pathname: isIsolatedDemo ? "/demo/bureau/overview" : "/bureau/overview",
            search: newSearch.toString()
        }, { replace: true });
    };

    const handleSecondary = () => {
        dismissGuide();
    };

    // Route enforcement
    useEffect(() => {
        if (currentStepIndex !== null && isVisible) {
            const step = STEPS[currentStepIndex];
            const isIsolatedDemo = location.pathname.startsWith("/demo");
            const prefix = isIsolatedDemo ? "/demo" : "";

            let expectedRoute = step.route;
            if (isIsolatedDemo && !expectedRoute.startsWith("/demo")) {
                expectedRoute = prefix + expectedRoute;
            }

            const currentPath = location.pathname;
            if (currentPath !== expectedRoute) {
                navigate(expectedRoute + "?demo=true", { replace: true });
            }
        }
    }, [currentStepIndex, isVisible, location.pathname, navigate]);

    // Robust Positioning Logic
    useEffect(() => {
        if (!isVisible || currentStepIndex === null) return;

        // Reset position on step change to avoid jumping
        setOverlayStyle(null);

        const step = STEPS[currentStepIndex];
        let attempts = 0;
        const maxAttempts = 10; // Try for 1 second
        let timer;

        const findAndPosition = () => {
            if (!step.targetSelector) {
                setOverlayStyle({ top: "50%", left: "50%", transform: "translate(-50%, -50%)" });
                return;
            }

            const target = document.querySelector(step.targetSelector);
            if (target) {
                // Ensure visible
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Delay slightly for scroll to settle
                setTimeout(() => {
                    const rect = target.getBoundingClientRect();
                    const placement = step.placement || "bottom";
                    const gap = 16;
                    const viewportW = window.innerWidth;
                    const viewportH = window.innerHeight;

                    // Box dimensions (estimated maximums)
                    const boxW = 500;
                    const boxH = 350; // Slightly overestimated to be safe
                    const safetyMargin = 20;

                    // 1. Calculate ideal Anchor Point (center of box will be relative to this)
                    // We calculate Top-Left corner of the box directly to make clamping easier.
                    let boxTop = 0;
                    let boxLeft = 0;

                    // Helper: centered horizontally
                    const centerH = rect.left + rect.width / 2 - boxW / 2;
                    // Helper: centered vertically
                    const centerV = rect.top + rect.height / 2 - boxH / 2;

                    switch (placement) {
                        case "top":
                            boxTop = rect.top - gap - boxH;
                            boxLeft = centerH;
                            break;
                        case "bottom":
                            boxTop = rect.bottom + gap;
                            boxLeft = centerH;
                            break;
                        case "left":
                            boxTop = centerV;
                            boxLeft = rect.left - gap - boxW;
                            break;
                        case "right":
                            boxTop = centerV;
                            boxLeft = rect.right + gap;
                            break;
                        default: // bottom
                            boxTop = rect.bottom + gap;
                            boxLeft = centerH;
                    }

                    // 2. Viewport Flip Logic
                    // If prefer Top but hits ceiling, flip to Bottom
                    if (placement === "top" && boxTop < safetyMargin) {
                        boxTop = rect.bottom + gap; // Flip to bottom
                    }
                    // If prefer Bottom but hits floor, flip to Top
                    else if (placement === "bottom" && (boxTop + boxH > viewportH - safetyMargin)) {
                        boxTop = rect.top - gap - boxH; // Flip to top
                    }

                    // 3. HARD CLAMP (Safety Net)
                    // Strictly ensure the box remains within viewport [safetyMargin...viewport]
                    // This might overlap the target, but visibility of the guide is priority #1.

                    // Clamp Vertical
                    if (boxTop < safetyMargin) boxTop = safetyMargin;
                    if (boxTop + boxH > viewportH - safetyMargin) {
                        boxTop = viewportH - boxH - safetyMargin;
                    }

                    // Clamp Horizontal
                    if (boxLeft < safetyMargin) boxLeft = safetyMargin;
                    if (boxLeft + boxW > viewportW - safetyMargin) {
                        boxLeft = viewportW - boxW - safetyMargin;
                    }

                    setOverlayStyle({
                        top: `${boxTop}px`,
                        left: `${boxLeft}px`,
                        width: `${boxW}px`, // Explicit width to match calculation
                        position: "fixed",
                        margin: 0
                    });
                }, 100);

            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    timer = setTimeout(findAndPosition, 100);
                } else {
                    console.warn("Target not found after retries:", step.targetSelector);
                    // Fallback to center
                    setOverlayStyle({ top: "50%", left: "50%", transform: "translate(-50%, -50%)" });
                }
            }
        };

        // Kick off
        timer = setTimeout(findAndPosition, 100);

        return () => clearTimeout(timer);
    }, [currentStepIndex, isVisible, location.pathname]);


    if (!isVisible || currentStepIndex === null) return null;

    const step = STEPS[currentStepIndex];

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-[100] pointer-events-none">
                {/* Dimmed backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/20"
                />

                {/* Only render card if we have a position style calculated */}
                {overlayStyle && (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={overlayStyle}
                        className="absolute bg-white/95 backdrop-blur-sm text-slate-800 shadow-xl rounded-xl p-5 max-w-xl w-[500px] border border-slate-200/60 pointer-events-auto"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    Guide {currentStepIndex + 1}/{STEPS.length}
                                </span>
                                <h2 className="text-base font-bold text-slate-900 leading-tight">
                                    {step.title}
                                </h2>
                            </div>
                            <button onClick={dismissGuide} className="text-slate-400 hover:text-slate-600 transition -mt-1 -mr-2 p-2">
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="text-slate-600 text-sm leading-snug whitespace-pre-line mb-4 pl-1">
                            {step.body}
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-slate-100/50">
                            <button
                                onClick={goToNextStep}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2 px-3 rounded-md shadow-sm transition-all flex items-center justify-center gap-2 group"
                            >
                                {step.cta}
                                {!step.isFinal && <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
                            </button>

                            {step.secondaryCta && (
                                <button
                                    onClick={handleSecondary}
                                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold py-2 px-3 rounded-md transition-colors"
                                >
                                    {step.secondaryCta}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    );
}

