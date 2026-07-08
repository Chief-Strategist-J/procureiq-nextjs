"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  onClick,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-zinc-900 text-white"
          : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
        )}
      />
      <span>{label}</span>
    </Link>
  );
}