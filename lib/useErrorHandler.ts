"use client";

import { useState, useCallback } from "react";
import type { AppError } from "@/types";

function classifyError(err: unknown): AppError {
  if (err instanceof TypeError && err.message.toLowerCase().includes("fetch")) {
    return {
      kind: "network",
      message:
        "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.",
      retryable: true,
    };
  }

  if (err instanceof Error) {
    const msg = err.message.toLowerCase();

    if (msg.includes("ai_api_key") || msg.includes("configuration")) {
      return {
        kind: "api",
        message: "Erreur de configuration serveur. Veuillez contacter le support.",
        retryable: false,
      };
    }

    if (
      msg.includes("unavailable") ||
      msg.includes("502") ||
      msg.includes("503")
    ) {
      return {
        kind: "api",
        message:
          "Le service IA est temporairement indisponible. Réessayez dans un moment.",
        retryable: true,
      };
    }

    if (
      msg.includes("json") ||
      msg.includes("parse") ||
      msg.includes("schema")
    ) {
      return {
        kind: "parse",
        message:
          "L'IA a renvoyé une réponse inattendue. Veuillez réessayer.",
        retryable: true,
      };
    }

    if (
      msg.includes("empty") ||
      msg.includes("required") ||
      msg.includes("missing")
    ) {
      return {
        kind: "validation",
        message: err.message,
        retryable: false,
      };
    }

    return {
      kind: "unknown",
      message: err.message,
      retryable: true,
    };
  }

  return {
    kind: "unknown",
    message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    retryable: true,
  };
}

export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null);

  const handleError = useCallback((err: unknown) => {
    setError(classifyError(err));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, handleError, clearError };
}
