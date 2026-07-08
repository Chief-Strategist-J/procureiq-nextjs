"use client";

import { usePathname } from "next/navigation";
import { Home, Activity, FileText, Bot, Settings } from "lucide-react";
import { SidebarItem } from "./sidebarItem";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Sessions", href: "/sessions", icon: Activity },
  { label: "Documentation", href: "/documentation", icon: FileText },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:h-screen md:fixed md:left-0 md:top-0 md:z-40 border-r border-zinc-800 bg-black text-white">
      {/* Brand */}
      <div className="flex items-center h-16 px-6 border-b border-zinc-800 shrink-0">
        <span className="text-lg font-light tracking-tight text-white">
          ProcureIQ
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-zinc-800 shrink-0">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">
            U
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-medium text-white truncate">
              User
            </span>
            <span className="text-[11px] text-zinc-500 truncate">
              user@example.com
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}