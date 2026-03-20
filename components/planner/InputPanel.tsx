"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface InputPanelProps {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
  hasResult: boolean;
}

export function InputPanel({
  value,
  onChange,
  onGenerate,
  onClear,
  isLoading,
  hasResult,
}: InputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCount = value.split("\n").filter((l) => l.trim()).length;

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onGenerate();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Vos tâches
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Une tâche par ligne pour de meilleurs résultats
          </p>
        </div>
        {(value || hasResult) && (
          <Button variant="ghost" size="sm" onClick={onClear} leftIcon={<ClearIcon />}>
            Effacer
          </Button>
        )}
      </div>

      {/* Textarea card */}
      <Card padding="none" className="overflow-hidden">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={
            "Entrez vos tâches...\n\nExemples :\n• Corriger le bug critique d'authentification\n• Réunion d'équipe à 10h\n• Réviser les pull requests\n• Rédiger le rapport trimestriel\n• Faire du sport"
          }
          className={cn(
            "w-full resize-none bg-transparent px-5 py-4",
            "min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]",
            "font-mono text-sm leading-relaxed",
            "text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600",
            "outline-none focus:ring-0 border-0",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/[0.06] px-5 py-2.5">
          <span className="font-mono text-[10px] text-gray-400 dark:text-gray-600">
            {lineCount > 0
              ? `${lineCount} tâche${lineCount !== 1 ? "s" : ""} · ⌘↵ pour générer`
              : "⌘↵ pour générer"}
          </span>
          <span className="font-mono text-[10px] text-gray-300 dark:text-gray-700">
            {value.length} car.
          </span>
        </div>
      </Card>

      {/* Generate button */}
      <Button
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={!value.trim()}
        onClick={onGenerate}
        leftIcon={!isLoading ? <GenerateIcon /> : undefined}
        className="w-full"
      >
        {isLoading ? "Génération en cours…" : "Générer le plan"}
      </Button>
    </motion.div>
  );
}

function GenerateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function ClearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
