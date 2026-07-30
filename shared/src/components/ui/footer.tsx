import React from "react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/20 mt-auto glass-effect">
      <div className="container mx-auto px-4 py-4 md:px-8 text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-2">
        <div>
          © {new Date().getFullYear()} ProcureIQ Inc. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}
