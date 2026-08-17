export interface UndoToastOptionsI {
  message: string;
  duration?: number;
  onUndo?: () => void;
  onExpire?: () => void;
}
export interface ToastStateI extends UndoToastOptionsI {
  id: number;
  duration: number;
  remaining: number;
}

export type ToastVariant = "success" | "danger" | "warning";

export interface ToastActionI {
  label: string;
  onClick: () => void;
}

export interface ToastOptionsI {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastActionI;
}

export interface ToastNotificationStateI extends ToastOptionsI {
  id: number;
  variant: ToastVariant;
  duration: number;
}
