import React, { useState, useRef } from "react";
import {
  CalendarDaysIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

// 🧩 CSS imports (måste vara först i vissa TS-projekt)
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/react-date-range-valiflow.css";

import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { useClickOutside } from "../hooks/useClickOutside";
import { exportAsPDF, exportAsCSV, shareReport } from "../utils/reportUtils";

interface ReportToolbarProps<T> {
  data: T[];
  reportElementId: string;
}

// 🧩 Typfix för `RangeKeyDict` (saknas i vissa versioner av react-date-range)
type RangeKeyDictFix = Record<string, any>;

export default function ReportToolbar<T>({
  data,
  reportElementId,
}: ReportToolbarProps<T>) {
  const [showDate, setShowDate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const dateRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useClickOutside(dateRef, () => setShowDate(false));
  useClickOutside(filterRef, () => setShowFilter(false));
  useClickOutside(exportRef, () => setShowExport(false));

  const handleRangeChange = (item: RangeKeyDictFix): void => {
    if (item.selection) {
      setRange([item.selection]);
    }
  };

  return (
    <div className="flex items-center gap-3 relative">
      {/* Date range */}
      <div className="relative" ref={dateRef}>
        <button
          onClick={() => setShowDate((prev) => !prev)}
          className="group flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 
                     hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 
                     text-slate-700 font-medium transition-all duration-200"
          id="integration-btn" // 👈 kan användas av touren
        >
          <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
          <span className="text-slate-700">
            {`${format(range[0].startDate, "MMM d")} – ${format(
              range[0].endDate,
              "MMM d"
            )}`}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
        </button>

        {showDate && (
          <div
            className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl 
                       shadow-[0_8px_25px_rgba(37,99,235,0.1)] z-50 p-2 animate-fadeIn"
          >
            <DateRange
              editableDateInputs
              onChange={handleRangeChange}
              moveRangeOnFirstSelection={false}
              ranges={range}
              rangeColors={["#0527FF"]}
              className="rounded-xl text-[13px] shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Filter dropdown */}
      <div className="relative" ref={filterRef}>
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="group flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 
                     hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 
                     text-slate-700 font-medium transition-all duration-200"
          id="sync-data-btn" // 👈 touren kan peka här
        >
          <FunnelIcon className="h-4 w-4 text-emerald-600" />
          <span>Filter</span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
        </button>

        {showFilter && (
          <div
            className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 
                       rounded-2xl shadow-[0_8px_25px_rgba(16,185,129,0.1)] z-50 p-4 text-sm"
          >
            <p className="text-slate-500 text-xs mb-2">
              Quick Filters (coming soon)
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="accent-emerald-500" />
                High-risk invoices only
              </label>
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="accent-emerald-500" />
                Include duplicates
              </label>
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="accent-emerald-500" />
                Exclude archived
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Export dropdown */}
      <div className="relative" ref={exportRef}>
        <button
          onClick={() => setShowExport((prev) => !prev)}
          className="group flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 
                     hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 
                     text-slate-700 font-medium transition-all duration-200"
          id="invite-btn" // 👈 touren kan peka här
        >
          <ArrowDownTrayIcon className="h-4 w-4 text-blue-600" />
          <span>Export</span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
        </button>

        {showExport && (
          <div
            className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl 
                       shadow-[0_8px_25px_rgba(37,99,235,0.1)] z-50 p-2 text-sm"
          >
            <button
              onClick={() => exportAsPDF(reportElementId, "valiflow-report.pdf")}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg 
                         hover:bg-blue-50 text-slate-700 font-medium transition-all duration-200"
            >
              <DocumentArrowDownIcon className="h-4 w-4 text-blue-600" />
              Export as PDF
            </button>

            <button
              onClick={() => exportAsCSV(data, "valiflow-report.csv")}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg 
                         hover:bg-blue-50 text-slate-700 font-medium transition-all duration-200"
            >
              <ArrowDownTrayIcon className="h-4 w-4 text-blue-600" />
              Export as CSV
            </button>

            <button
              onClick={() => shareReport(window.location.href)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg 
                         hover:bg-blue-50 text-slate-700 font-medium transition-all duration-200"
            >
              <ShareIcon className="h-4 w-4 text-blue-600" />
              Share report link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
