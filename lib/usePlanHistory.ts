"use client";

import { useState, useEffect, useCallback } from "react";
import type { HistoryEntry, PlanResponse } from "@/types";

const STORAGE_KEY = "dayflow-plan-history";
const MAX_ENTRIES = 20;

function loadFromStorage(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

export function usePlanHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    setHistory(loadFromStorage());
    setHydrated(true);
  }, []);

  const addEntry = useCallback(
    (plan: PlanResponse, inputText: string): string => {
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        inputSummary:
          inputText.split("\n").find((l) => l.trim()) ?? "Untitled plan",
        plan,
      };

      setHistory((prev) => {
        const updated = [entry, ...prev].slice(0, MAX_ENTRIES);
        saveToStorage(updated);
        return updated;
      });

      return entry.id;
    },
    []
  );

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, hydrated, addEntry, removeEntry, clearHistory };
}
