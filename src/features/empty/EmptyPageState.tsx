import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { signupSlice } from "@/features/signup/signupSlice";

export type Scenario = "catalog" | "inbox" | "audit";

export function useEmptyShowcasePageState() {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.signup.ui);

  const { activeScenario = "catalog", isSimulating = false } = ui.formFields ?? {};

  const triggerSimulation = useCallback(() => {
    dispatch(signupSlice.actions.setFormField({ field: "isSimulating", value: true }));
    setTimeout(() => {
      dispatch(signupSlice.actions.setFormField({ field: "isSimulating", value: false }));
    }, 1500);
  }, [dispatch]);

  return {
    dispatch,
    ui,
    activeScenario: activeScenario as Scenario,
    isSimulating: !!isSimulating,
    triggerSimulation,
  };
}
