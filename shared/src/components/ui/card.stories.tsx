import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "./card"
import { Button } from "./button"

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="max-w-[400px]">
      <CardHeader>
        <CardTitle>Asset Deployment Contract</CardTitle>
        <CardDescription>Verify smart contract details for deployment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p><strong>Contract ID:</strong> tx-98834-889</p>
        <p><strong>Status:</strong> Pending Signature</p>
        <p><strong>Gas Limit:</strong> 210,000 Gwei</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Reject</Button>
        <Button>Deploy Contract</Button>
      </CardFooter>
    </Card>
  ),
}
