import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Mindset Debugger – AI-Powered Mindset Analytics",
  description:
    "Mindset Debugger analyzes your writing with AI to detect emotional patterns, limiting beliefs, and mental loops – and gives you practical insights to upgrade your mindset.",
  metadataBase: new URL("https://www.mindsetdebugger.com"),
  openGraph: {
    title: "Mindset Debugger – Understand your mind. Upgrade your mindset.",
    description:
      "AI-powered cognitive mirror that analyzes your thoughts and reveals patterns, triggers, and emotional loops.",
    url: "https://www.mindsetdebugger.com",
    siteName: "Mindset Debugger",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindset Debugger – AI-Powered Mindset Analytics",
    description:
      "See your emotional patterns, mental loops and limiting beliefs through AI.",
  },
  keywords: [
    "mindset",
    "AI coach",
    "mental health",
    "emotional analytics",
    "self-improvement",
    "journaling AI",
    "cognitive patterns",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
