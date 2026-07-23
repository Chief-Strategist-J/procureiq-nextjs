import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { signupSlice } from "./signupSlice";
import { AuthApi } from "@/app/login/api-client";

export class LoginPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public ui: any
  ) {}

  get username() {
    return this.ui.formFields.username ?? "";
  }

  get password() {
    return this.ui.formFields.password ?? "";
  }

  get error() {
    return this.ui.localError;
  }

  get loading() {
    return !!this.ui.formFields.loading;
  }

  get isResetOpen() {
    return !!this.ui.formFields.isResetOpen;
  }

  handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.username || !this.password) {
      this.dispatch(signupSlice.actions.setLocalError("Please fill in all fields"));
      return;
    }

    this.dispatch(signupSlice.actions.setFormField({ field: "loading", value: true }));
    this.dispatch(signupSlice.actions.setLocalError(""));

    try {
      const data = await AuthApi.login({ username: this.username, password: this.password });
      localStorage.setItem("procureiq_token", data.token);
      localStorage.setItem("procureiq_user", JSON.stringify(data.user));
      this.router.push("/");
    } catch (err: any) {
      this.dispatch(signupSlice.actions.setLocalError(err.message || "Something went wrong. Please try again."));
    } finally {
      this.dispatch(signupSlice.actions.setFormField({ field: "loading", value: false }));
    }
  };
}

export function useLoginPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.signup.ui);

  return new LoginPageState(router, dispatch, ui);
}
