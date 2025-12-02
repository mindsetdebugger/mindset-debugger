"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

import {
  Home,
  Search,
  BookText,
  LineChart,
  Target,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const supabase = supabaseBrowser();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  const menu = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/insights", label: "Insights", icon: Search },
    { href: "/dashboard/history", label: "History", icon: BookText },
    { href: "/dashboard/trends", label: "Trends", icon: LineChart },
    { href: "/dashboard/roadmap", label: "Roadmap", icon: Target },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-full border-r bg-card flex flex-col">
      <div className="h-16 flex items-center px-6 text-xl font-semibold border-b">
        🧠 Mindset
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onClose?.()}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition"
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground w-full text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
