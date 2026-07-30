import React, { useState, useEffect } from "react"
import { Cpu } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-4 flex-1">
      <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary animate-bounce">
        <Cpu className="h-8 w-8" />
      </div>
      <p className="text-xs font-mono text-muted-foreground animate-pulse">
        Loading Micro Frontend zone bundle...
      </p>
    </div>
  )
}
