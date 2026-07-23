import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { signupSlice } from "@/features/signup/signupSlice";

type Scenario = "catalog" | "inbox" | "audit";

export class EmptyShowcasePageState {
  constructor(
    public dispatch: ReturnType<typeof useAppDispatch>,
    public ui: any
  ) {}

  get activeScenario() {
    return (this.ui.formFields.activeScenario as Scenario) ?? "catalog";
  }

  get isSimulating() {
    return !!this.ui.formFields.isSimulating;
  }

  triggerSimulation = () => {
    this.dispatch(signupSlice.actions.setFormField({ field: "isSimulating", value: true }));
    setTimeout(() => {
      this.dispatch(signupSlice.actions.setFormField({ field: "isSimulating", value: false }));
    }, 1500);
  };
}

export function useEmptyShowcasePageState() {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.signup.ui);

  return new EmptyShowcasePageState(dispatch, ui);
}
