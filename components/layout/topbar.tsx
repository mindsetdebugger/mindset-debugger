"use client";

import { Menu } from "lucide-react";

export default function Topbar({ onMenu }: { onMenu?: () => void }) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur-md">
      
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded hover:bg-accent"
        onClick={onMenu}
      >
        <Menu size={24} />
      </button>

      <h1 className="text-lg font-semibold">Mindset Debugger</h1>

      <div className="hidden md:block">
        {/* right content (avatar, etc) */}
      </div>
    </header>
  );
}
