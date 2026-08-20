import { useState, useCallback } from "react";
import { TelemetryService } from "@/lib/telemetry";

export interface MachineConfig {
  initial: string;
  states: {
    [key: string]: {
      on: {
        [event: string]: string;
      };
    };
  };
}

export function useDataMachine(config: MachineConfig, machineName: string) {
  const [state, setState] = useState(config.initial);

  const transition = useCallback((event: string) => {
    const span = TelemetryService.createSpan(`state-machine:${machineName}:transition:${event}`);
    setState((current) => {
      const nextState = config.states[current]?.on[event];
      if (nextState) {
        console.log(`[MACHINE:${machineName}] Transition: ${current} --(${event})--> ${nextState} (Trace: ${span.traceId})`);
        return nextState;
      }
      console.warn(`[MACHINE:${machineName}] Invalid transition from ${current} via ${event}`);
      return current;
    });
  }, [config, machineName]);

  return [state, transition] as const;
}
