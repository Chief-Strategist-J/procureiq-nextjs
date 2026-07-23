import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { signupSlice } from "@/features/signup/signupSlice";

export class ErrorTestPageState {
  constructor(
    public dispatch: ReturnType<typeof useAppDispatch>,
    public ui: any
  ) {}

  get shouldCrash() {
    return !!this.ui.formFields.shouldCrash;
  }

  triggerCrash = () => {
    this.dispatch(signupSlice.actions.setFormField({ field: "shouldCrash", value: true }));
  };
}

export function useErrorTestPageState() {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.signup.ui);

  return new ErrorTestPageState(dispatch, ui);
}
