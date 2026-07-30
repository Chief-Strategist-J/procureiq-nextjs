"use client"

import React, { useEffect, useState } from "react"
import { AlertTriangle, RefreshCw, Server, Cpu } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [retrying, setRetrying] = useState(false)
  const [autoRetryCount, setAutoRetryCount] = useState(0)

  useEffect(() => {
    // Automatically retry if proxy connection hangs up during micro-frontend compilation
    const isProxyHangup = 
      error?.message?.includes("ECONNRESET") || 
      error?.message?.includes("socket hang up") ||
      error?.message?.includes("Failed to proxy") ||
      autoRetryCount < 5

    if (isProxyHangup && autoRetryCount < 8) {
      const timer = setTimeout(() => {
        setAutoRetryCount((prev) => prev + 1)
        reset()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [error, reset, autoRetryCount])

  const handleManualRetry = () => {
    setRetrying(true)
    setTimeout(() => {
      reset()
      setRetrying(false)
    }, 500)
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-6 flex-1">
      <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse">
        <Cpu className="h-12 w-12" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-extrabold tracking-tight">Micro Frontend Warming Up...</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The requested service zone is compiling its initial development bundle. Automatically connecting...
        </p>
      </div>

      <div className="flex items-center space-x-2 text-xs font-mono bg-muted/60 px-4 py-2 rounded border text-muted-foreground">
        <Server className="h-4 w-4 text-amber-500 animate-spin" />
        <span>Syncing zone proxy connection (Attempt {autoRetryCount + 1}/4)</span>
      </div>

      <button
        onClick={handleManualRetry}
        disabled={retrying}
        className="inline-flex items-center justify-center px-4 py-2 rounded-md text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all space-x-2"
      >
        <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
        <span>{retrying ? "Connecting..." : "Retry Connection"}</span>
      </button>
    </div>
  )
}
