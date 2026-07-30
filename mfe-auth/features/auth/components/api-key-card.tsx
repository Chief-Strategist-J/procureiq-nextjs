import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "@shared/index"
import { AUTH_STRINGS } from "../constants/auth-strings"

export interface ApiKeyCardProps {
  apiKey: string
  generating: boolean
  onGenerateKey: () => void
}

export const ApiKeyCard: React.FC<ApiKeyCardProps> = ({
  apiKey,
  generating,
  onGenerateKey,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{AUTH_STRINGS.API_KEY.TITLE}</CardTitle>
        <CardDescription>{AUTH_STRINGS.API_KEY.DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs text-muted-foreground">
          {AUTH_STRINGS.API_KEY.USAGE_NOTE}
        </div>
        
        {apiKey && (
          <div className="bg-muted p-3 rounded border font-mono text-[10px] break-all select-all text-emerald-500">
            {apiKey}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onGenerateKey} 
          disabled={generating} 
          className="w-full font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950"
        >
          {generating ? AUTH_STRINGS.API_KEY.BTN_GENERATING : AUTH_STRINGS.API_KEY.BTN_GENERATE}
        </Button>
      </CardFooter>
    </Card>
  )
}
