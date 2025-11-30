// components/layout/topbar.tsx
"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar"; // ako nemaš ovu shadcn komponentu, dodam

export default function Topbar() {
  return (
    <header className="h-16 border-b flex items-center justify-between px-8 bg-background">
      <div className="text-lg font-medium">Dashboard</div>

      <div className="flex items-center gap-3">
        <Avatar />
        <span className="text-sm opacity-70">Ivan</span>
      </div>
    </header>
  );
}
