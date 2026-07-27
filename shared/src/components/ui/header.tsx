"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "./button"
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Cpu, 
  Key, 
  Bell, 
  Mail, 
  Megaphone, 
  MapPin, 
  Github, 
  Terminal, 
  Database,
  Link2
} from "lucide-react"

interface HeaderProps {
  activePath?: string
}

export function Header({ activePath }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState("")

  // Set mounted on client to prevent hydration mismatch for theme toggler
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  const navItems = [
    { name: "Host Portal", path: "/", icon: Terminal, color: "text-sky-500" },
    { name: "Crypto", path: "/crypto", icon: Cpu, color: "text-amber-500" },
    { name: "Auth", path: "/auth", icon: Key, color: "text-emerald-500" },
    { name: "Notifications", path: "/notifications", icon: Bell, color: "text-rose-500" },
    { name: "Email", path: "/email", icon: Mail, color: "text-indigo-500" },
    { name: "Campaigns", path: "/campaigns", icon: Megaphone, color: "text-violet-500" },
    { name: "Field Service", path: "/fieldservice", icon: MapPin, color: "text-teal-500" },
    { name: "GitHub", path: "/github", icon: Github, color: "text-slate-500" },
    { name: "Jobs", path: "/jobs", icon: Link2, color: "text-cyan-500" },
  ]

  // Detect which path matches
  const isItemActive = (path: string) => {
    if (activePath) {
      return activePath === path || (path !== "/" && activePath.startsWith(path))
    }
    return currentPath === path || (path !== "/" && currentPath.startsWith(path))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md glass-effect">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-sky-500 animate-pulse-glow" />
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
            ProcureIQ
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isItemActive(item.path)
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent/50 ${
                  active 
                    ? "text-primary bg-primary/10 border border-primary/20 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span>{item.name}</span>
              </a>
            )
          })}
        </nav>

        {/* System Controls & Connections */}
        <div className="flex items-center space-x-3">
          
          {/* Connection Indicators (Desktop only) */}
          <div className="hidden lg:flex items-center space-x-3 text-xs bg-muted/50 border rounded-full px-3 py-1 font-mono text-muted-foreground">
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AlloyDB</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>WebRTC</span>
            </span>
          </div>

          {/* Theme toggler */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 transition-all" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-sky-500 transition-all" />
            )}
          </Button>

          {/* Hamburger Menu Toggle (Mobile & Tablet) */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden w-9 h-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile & Tablet Slider Overlay Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-4 duration-300">
          <nav className="container grid grid-cols-1 gap-2 p-6 md:grid-cols-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(item.path)
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active 
                      ? "text-primary bg-primary/10 border border-primary/20" 
                      : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span>{item.name}</span>
                </a>
              )}
            )}
            
            {/* Mobile Connection status */}
            <div className="col-span-full mt-4 flex justify-around items-center rounded-lg border bg-muted/30 p-3 text-xs font-mono text-muted-foreground">
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AlloyDB Omni: Connected</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>WebRTC WS: Active</span>
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
