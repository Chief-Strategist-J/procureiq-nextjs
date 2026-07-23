import React from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { signupSlice } from "./signupSlice";

export class ResetPasswordFormState {
  constructor(
    public searchParams: ReturnType<typeof useSearchParams>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public ui: any
  ) {}

  get token() {
    return this.searchParams.get("token") || "";
  }

  get password() {
    return this.ui.formFields.resetPassword ?? "";
  }

  get confirmPassword() {
    return this.ui.formFields.resetConfirmPassword ?? "";
  }

  get loading() {
    return !!this.ui.formFields.resetLoading;
  }

  get success() {
    return !!this.ui.formFields.resetSuccess;
  }

  get error() {
    return this.ui.localError;
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.token) {
      this.dispatch(signupSlice.actions.setLocalError("Authorization reset token is missing from the query payload."));
      return;
    }
    if (this.password.length < 8) {
      this.dispatch(signupSlice.actions.setLocalError("Password must be at least 8 characters in length."));
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.dispatch(signupSlice.actions.setLocalError("Confirmation password does not match."));
      return;
    }

    this.dispatch(signupSlice.actions.setFormField({ field: "resetLoading", value: true }));
    this.dispatch(signupSlice.actions.setLocalError(""));

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${backendUrl}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: this.token, newPassword: this.password }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Reset request rejected by server. Token may be expired.");
      }

      this.dispatch(signupSlice.actions.setFormField({ field: "resetSuccess", value: true }));
    } catch (err: any) {
      this.dispatch(signupSlice.actions.setLocalError(err.message || "Failed to update credentials. Please try again."));
    } finally {
      this.dispatch(signupSlice.actions.setFormField({ field: "resetLoading", value: false }));
    }
  };
}

export function useResetPasswordFormState() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.signup.ui);

  return new ResetPasswordFormState(searchParams, dispatch, ui);
}
