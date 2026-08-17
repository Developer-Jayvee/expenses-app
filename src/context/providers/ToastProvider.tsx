import UndoToastList from "@c/components/toast/UndoToastList";
import ToastList from "@c/components/toast/ToastList";
import useUndoToast from "@c/hooks/useUndoToast";
import useToastNotification from "@c/hooks/useToastNotification";
import type { ToastOptionsI, UndoToastOptionsI } from "@c/types/toastTypes";
import { createContext, useMemo } from "react";
import { ContextProvider, useContextProvider } from "./BaseContextProvider";

export interface ToastContextI {
  showUndoToast: (options: UndoToastOptionsI) => void;
  showToast: (options: ToastOptionsI) => void;
}

export const ToastContext = createContext<ToastContextI | null>({
  showUndoToast: () => {},
  showToast: () => {},
});

export const useToast = () => useContextProvider<ToastContextI>(ToastContext);

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toasts, showUndoToast, undo } = useUndoToast();
  const {
    toasts: notifications,
    showToast,
    dismissToast,
  } = useToastNotification();

  const value = useMemo<ToastContextI>(
    () => ({ showUndoToast, showToast }),
    [showUndoToast, showToast],
  );

  return (
    <ContextProvider<ToastContextI | null>
      context={ToastContext}
      values={value}
    >
      <>
        {children}
        <UndoToastList toasts={toasts} onUndo={undo} />
        <ToastList toasts={notifications} onDismiss={dismissToast} />
      </>
    </ContextProvider>
  );
}
