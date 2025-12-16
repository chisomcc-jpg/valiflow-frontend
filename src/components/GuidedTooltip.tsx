import { motion } from "framer-motion";
import React from "react";

interface TooltipProps {
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  title: string;
  desc: string;
  onNext: () => void;
  onSkip: () => void;
}

const GuidedTooltip: React.FC<TooltipProps> = ({
  position,
  title,
  desc,
  onNext,
  onSkip,
}) => {
  if (!position) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-[9999]"
      style={{
        top: position.top + position.height + 12,
        left: position.left,
      }}
    >
      <div className="bg-white shadow-lg rounded-xl p-4 border border-slate-200 w-72 relative">
        <h3 className="text-slate-800 font-semibold mb-1">{title}</h3>
        <p className="text-slate-500 text-sm mb-3">{desc}</p>

        <div className="flex justify-between items-center">
          <button
            onClick={onSkip}
            className="text-slate-400 text-xs underline hover:text-slate-500"
          >
            Hoppa över
          </button>
          <button
            onClick={onNext}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            Nästa →
          </button>
        </div>

        {/* pilen */}
        <div className="absolute w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-transparent border-b-white -top-2 left-6" />
      </div>
    </motion.div>
  );
};

export default GuidedTooltip;
