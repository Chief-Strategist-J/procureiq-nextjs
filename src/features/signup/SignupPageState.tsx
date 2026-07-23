import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import {
  createRequest,
  selectSignupStatus,
  selectSignupLastAction,
  resetLastAction,
  signupSlice,
} from "./signupSlice";

export class SignupPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public status: string,
    public lastAction: any,
    public ui: any
  ) {}

  get username() {
    return this.ui.formFields.username ?? "";
  }

  get email() {
    return this.ui.formFields.email ?? "";
  }

  get password() {
    return this.ui.formFields.password ?? "";
  }

  get localError() {
    return this.ui.localError;
  }

  get loading() {
    return this.status === "loading";
  }

  get error() {
    return this.localError || (this.lastAction?.status === "error" ? this.lastAction.message : "");
  }

  get success() {
    return this.lastAction?.status === "success" ? "Account created successfully! Redirecting to login..." : "";
  }

  handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.username || !this.email || !this.password) {
      this.dispatch(signupSlice.actions.setLocalError("Please fill in all fields"));
      return;
    }
    this.dispatch(signupSlice.actions.setLocalError(""));
    this.dispatch(createRequest({ username: this.username, email: this.email, password: this.password }));
  };
}

export function useSignupPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectSignupStatus);
  const lastAction = useAppSelector(selectSignupLastAction);
  const ui = useAppSelector((state) => state.signup.ui);

  useEffect(() => {
    if (lastAction?.status === "success") {
      const timer = setTimeout(() => {
        dispatch(resetLastAction());
        router.push("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lastAction, router, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetLastAction());
    };
  }, [dispatch]);

  return new SignupPageState(router, dispatch, status, lastAction, ui);
}
