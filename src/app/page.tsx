"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus, LogOut, CheckCircle2, User } from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("procureiq_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("procureiq_token");
    localStorage.removeItem("procureiq_user");
    setUser(null);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-black text-white font-sans selection:bg-zinc-800 p-4">
      <main className="flex flex-col items-center max-w-lg w-full p-8 text-center space-y-6 bg-zinc-950/40 border border-zinc-900 rounded-2xl backdrop-blur-sm">
        <h1 className="text-4xl font-light tracking-tight">
          ProcureIQ
        </h1>
        <p className="text-zinc-400 text-sm font-light leading-relaxed">
          Enterprise procurement platform built on AlloyDB for PostgreSQL. Connect services, manage catalogs, and run AI-powered evaluations.
        </p>

        {user ? (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-sm text-zinc-300">
              <User className="w-4 h-4 text-zinc-500" />
              <span>Logged in as <strong className="text-white">{user.username}</strong> ({user.email})</span>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex gap-3 w-full">
              <Link 
                href="/login" 
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all text-center"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm font-medium hover:bg-zinc-800 transition-all text-center"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </div>
          </div>
        )}


      </main>
    </div>
  );
}
