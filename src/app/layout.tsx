import type { Metadata } from "next";
import { Cinzel, EB_Garamond, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const unifraktur = UnifrakturMaguntia({
  variable: "--font-unifraktur",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scriptorium — Biblioteca Monástica",
  description:
    "Crônica de leituras à luz de velas. Registre os tomos que lê, os que estão em leitura e o pergaminho de sua jornada através dos séculos.",
  keywords: [
    "biblioteca",
    "monástica",
    "leitura",
    "tomo",
    "scriptorium",
    "crônica",
    "livros",
  ],
  authors: [{ name: "Scriptorium" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Scriptorium — Biblioteca Monástica",
    description:
      "Registre os tomos que lê e a crônica de sua jornada literária à luz de velas.",
    siteName: "Scriptorium",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${cinzel.variable} ${garamond.variable} ${unifraktur.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
