import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import type { ReactNode } from "react";

export const metadata = {
  title: "Mindset Debugger",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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
