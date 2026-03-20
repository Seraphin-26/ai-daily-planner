"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  copyPlanToClipboard,
  downloadPlanAsTxt,
  exportPlanAsJSON,
  exportPlanAsPDF,
} from "@/lib/planUtils";
import type { PlanResponse } from "@/types";

interface ExportBarProps {
  plan: PlanResponse;
  generatedAt?: string;
  onClear: () => void;
}

type CopyState = "idle" | "success" | "error";

export function ExportBar({ plan, generatedAt, onClear }: ExportBarProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [downloading, setDownloading] = useState(false);
  const [exportingJSON, setExportingJSON] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  async function handleCopy() {
    try {
      await copyPlanToClipboard(plan);
      setCopyState("success");
      setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  function handleDownloadTxt() {
    setDownloading(true);
    try { downloadPlanAsTxt(plan); } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  }

  function handleExportJSON() {
    setExportingJSON(true);
    try { exportPlanAsJSON(plan, generatedAt); } finally {
      setTimeout(() => setExportingJSON(false), 800);
    }
  }

  function handleExportPDF() {
    setExportingPDF(true);
    try { exportPlanAsPDF(plan, generatedAt); } finally {
      setTimeout(() => setExportingPDF(false), 1000);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Copy */}
      <Button
        variant="outline" size="sm" onClick={handleCopy}
        leftIcon={
          copyState === "success" ? <CheckIcon className="text-emerald-500" /> :
          copyState === "error"   ? <XIcon className="text-red-500" /> : <CopyIcon />
        }
        className={
          copyState === "success" ? "border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400" :
          copyState === "error"   ? "border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400" : ""
        }
      >
        <AnimatePresence mode="wait">
          <motion.span key={copyState} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
            {copyState === "success" ? "Copié !" : copyState === "error" ? "Échec" : "Copier"}
          </motion.span>
        </AnimatePresence>
      </Button>

      {/* Download .txt */}
      <Button variant="outline" size="sm" onClick={handleDownloadTxt} isLoading={downloading} leftIcon={!downloading ? <DownloadIcon /> : undefined}>
        .txt
      </Button>

      {/* Export JSON */}
      <Button variant="outline" size="sm" onClick={handleExportJSON} isLoading={exportingJSON} leftIcon={!exportingJSON ? <JSONIcon /> : undefined}>
        JSON
      </Button>

      {/* Export PDF */}
      <Button variant="outline" size="sm" onClick={handleExportPDF} isLoading={exportingPDF} leftIcon={!exportingPDF ? <PDFIcon /> : undefined}
        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/25 hover:bg-red-50 dark:hover:bg-red-500/10"
      >
        PDF
      </Button>

      {/* Clear */}
      <Button variant="ghost" size="sm" onClick={onClear} leftIcon={<TrashIcon />}
        className="ml-auto text-gray-400 hover:text-red-500 dark:hover:text-red-400"
      >
        Effacer
      </Button>
    </div>
  );
}

function CopyIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>; }
function CheckIcon({ className }: { className?: string }) { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>; }
function XIcon({ className }: { className?: string }) { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }
function DownloadIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function JSONIcon()  { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>; }
function PDFIcon()   { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function TrashIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>; }
