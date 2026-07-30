"use client"

import React from "react"
import { Card, CardContent } from "@shared/index"
import { Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-8 max-w-3xl flex justify-center items-center min-h-[60vh]">
      <Card className="w-full text-center p-8 border-primary/20 bg-gradient-to-b from-background to-muted/30 shadow-lg">
        <CardContent className="space-y-4 pt-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome to ProcureIQ
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
            Powered by <span className="font-semibold text-primary">Scaibu</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
