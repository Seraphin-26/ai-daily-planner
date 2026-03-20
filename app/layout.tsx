import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "DayFlow — Planificateur IA",
    template: "%s | DayFlow",
  },
  description:
    "Planification quotidienne par IA. Entrez vos tâches et obtenez un emploi du temps structuré et priorisé en quelques secondes.",
  keywords: ["planificateur", "IA", "productivité", "gestion des tâches", "emploi du temps"],
  authors: [{ name: "DayFlow" }],
  openGraph: {
    title: "DayFlow — Planificateur IA",
    description: "Planifiez votre journée, sans effort.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
