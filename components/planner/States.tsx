"use client";

import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 dark:border-white/[0.08] py-16 px-8 text-center"
    >
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.02]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-gray-600">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
        </div>
        <div className="absolute -inset-2 rounded-3xl border border-gray-100 dark:border-white/[0.04]" />
        <div className="absolute -inset-4 rounded-[28px] border border-gray-50 dark:border-white/[0.02]" />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Votre plan apparaîtra ici
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-600 leading-relaxed">
          Ajoutez vos tâches à gauche et cliquez sur{" "}
          <span className="font-mono text-indigo-500 dark:text-indigo-400">
            Générer le plan
          </span>
        </p>
      </div>

      <div className="flex gap-2 mt-1 flex-wrap justify-center">
        {["Haute priorité", "Blocs horaires", "Organisé par IA"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] px-2.5 py-1 text-[10px] text-gray-400 dark:text-gray-600"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
