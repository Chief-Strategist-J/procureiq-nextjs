import React from "react"
import { Database, Server, Terminal, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/20 mt-auto glass-effect">
      <div className="container mx-auto px-4 py-8 md:px-8">
        
        {/* Footer Top Grids */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 border-b pb-8">
          
          {/* Brand Col */}
          <div className="flex flex-col space-y-3">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              ProcureIQ
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Unified enterprise procurement and asset tracking system utilizing high-performance multi-service backends.
            </p>
          </div>

          {/* Micro Frontend links Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-foreground">
              Modules
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/crypto" className="hover:text-foreground hover:underline">Crypto & Smart Contracts</a></li>
              <li><a href="/auth" className="hover:text-foreground hover:underline">Access & Roles Management</a></li>
              <li><a href="/notifications" className="hover:text-foreground hover:underline">Notifications Center</a></li>
              <li><a href="/campaigns" className="hover:text-foreground hover:underline">RFPs & Live Bidding</a></li>
            </ul>
          </div>

          {/* Infrastructure status Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-foreground">
              Services Status
            </h4>
            <ul className="space-y-2 text-xs font-mono text-muted-foreground">
              <li className="flex items-center space-x-1.5">
                <Database className="h-3.5 w-3.5 text-sky-500" />
                <span>AlloyDB: Operational</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Server className="h-3.5 w-3.5 text-emerald-500" />
                <span>Spring Boot: Online</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Terminal className="h-3.5 w-3.5 text-violet-500" />
                <span>FastAPI: Active</span>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-foreground">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/github" className="flex items-center space-x-1 hover:text-foreground">
                <Github className="h-3.5 w-3.5" />
                <span>Docs Pipeline</span>
              </a></li>
              <li><a href="/jobs" className="hover:text-foreground hover:underline">System Jobs Log</a></li>
              <li><a href="/fieldservice" className="hover:text-foreground hover:underline">Dispatching Map</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom metadata */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center pt-8 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} ProcureIQ Inc. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>Next.js Multi-Zones Architecture</span>
            <span className="h-3 w-px bg-border" />
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
