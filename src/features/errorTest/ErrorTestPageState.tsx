import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { signupSlice } from "@/features/signup/signupSlice";

export function useErrorTestPageState() {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.signup.ui);

  const { shouldCrash = false } = ui.formFields ?? {};

  const triggerCrash = useCallback(() => {
    dispatch(signupSlice.actions.setFormField({ field: "shouldCrash", value: true }));
  }, [dispatch]);

  return {
    dispatch,
    ui,
    shouldCrash: !!shouldCrash,
    triggerCrash,
  };
}
