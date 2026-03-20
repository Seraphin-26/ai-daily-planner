"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/lib/theme";
import { usePlanHistory } from "@/lib/usePlanHistory";
import { useErrorHandler } from "@/lib/useErrorHandler";
import { Navbar } from "@/components/planner/Navbar";
import { InputPanel } from "@/components/planner/InputPanel";
import { ResultPanel } from "@/components/planner/ResultPanel";
import { HistoryPanel } from "@/components/planner/HistoryPanel";
import type { PlanResponse, APIResponse } from "@/types";

function PlannerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | undefined>();

  const { error, handleError, clearError } = useErrorHandler();
  const { history, hydrated, addEntry, removeEntry, clearHistory } = usePlanHistory();

  async function handleGenerate() {
    if (!input.trim()) return;
    setLoading(true);
    clearError();
    setPlan(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: input.trim() }),
      });
      const data: APIResponse = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Échec de la génération.");
      const now = new Date().toISOString();
      setPlan(data.plan);
      setGeneratedAt(now);
      addEntry(data.plan, input);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setInput("");
    setPlan(null);
    setGeneratedAt(undefined);
    clearError();
  }

  function handleRestore(restored: PlanResponse) {
    setPlan(restored);
    setGeneratedAt(new Date().toISOString());
    clearError();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/[0.07] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-violet-500/[0.03] dark:bg-violet-500/[0.05] blur-3xl" />
      </div>

      <Navbar
        historySlot={
          hydrated ? (
            <HistoryPanel
              entries={history}
              onRestore={handleRestore}
              onRemove={removeEntry}
              onClearAll={clearHistory}
            />
          ) : null
        }
      />

      <main className="relative mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 sm:mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-500/25 bg-indigo-50 dark:bg-indigo-500/10 px-3.5 py-1.5 mb-4">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Planification quotidienne par IA
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Planifiez votre journée,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              sans effort
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Entrez vos tâches en texte libre. L&apos;IA les structure, les priorise
            et les planifie dans un emploi du temps professionnel.
          </p>
        </motion.div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <InputPanel
            value={input}
            onChange={setInput}
            onGenerate={handleGenerate}
            onClear={handleClear}
            isLoading={loading}
            hasResult={!!plan}
          />
          <ResultPanel
            plan={plan}
            isLoading={loading}
            error={error}
            onClear={handleClear}
            onRetry={handleGenerate}
            onDismissError={clearError}
            generatedAt={generatedAt}
          />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 dark:border-white/[0.06] pt-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
            <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
              DayFlow · Planificateur IA
            </p>
            <span className="hidden sm:inline text-gray-200 dark:text-gray-800">·</span>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Fait par{" "}
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Seraphin
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            {["Confidentialité", "Conditions", "Docs"].map((link) => (
              <a key={link} href="#" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </motion.footer>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <PlannerPage />
    </ThemeProvider>
  );
}