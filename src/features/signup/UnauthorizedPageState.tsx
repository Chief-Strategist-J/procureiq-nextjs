import React, { useState } from "react";

export class UnauthorizedPageState {
  constructor(
    public requestStatus: "idle" | "requesting" | "requested",
    public setRequestStatus: React.Dispatch<React.SetStateAction<"idle" | "requesting" | "requested">>
  ) {}

  handleRequestAccess = () => {
    this.setRequestStatus("requesting");
    setTimeout(() => {
      this.setRequestStatus("requested");
    }, 2000);
  };
}

export function useUnauthorizedPageState() {
  const [requestStatus, setRequestStatus] = useState<"idle" | "requesting" | "requested">("idle");
  return new UnauthorizedPageState(requestStatus, setRequestStatus);
}
