import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { fetchRequest, selectEmailState } from "./emailSlice";

export class EmailPageState {
  constructor(
    public router: ReturnType<typeof useRouter>,
    public dispatch: ReturnType<typeof useAppDispatch>,
    public emailState: any
  ) {}

  get items() {
    return this.emailState.items.data || [];
  }

  get loading() {
    return this.emailState.items.status === "loading";
  }

  get error() {
    return this.emailState.items.error;
  }

  fetchItems = () => {
    this.dispatch(fetchRequest());
  };
}

export function useEmailPageState() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const emailState = useAppSelector(selectEmailState);

  const fetchItems = useCallback(() => {
    dispatch(fetchRequest());
  }, [dispatch]);

  useEffect(() => {
    if (emailState.items.status === "idle") {
      fetchItems();
    }
  }, [emailState.items.status, fetchItems]);

  return new EmailPageState(router, dispatch, emailState);
}
