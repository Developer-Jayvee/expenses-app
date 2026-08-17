import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ToastNotificationStateI,
  ToastOptionsI,
} from "@c/types/toastTypes";

const DEFAULT_DURATION = 5000;

export default function useToastNotification() {
  const [toasts, setToasts] = useState<ToastNotificationStateI[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const idRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    const timeout = timers.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptionsI) => {
      const id = ++idRef.current;
      const duration = options.duration ?? DEFAULT_DURATION;
      const variant = options.variant ?? "success";

      setToasts((prev) => [...prev, { ...options, id, duration, variant }]);

      const timeout = setTimeout(() => dismissToast(id), duration);
      timers.current.set(id, timeout);
    },
    [dismissToast],
  );

  useEffect(() => {
    const timerMap = timers.current;
    return () => {
      timerMap.forEach((timeout) => clearTimeout(timeout));
      timerMap.clear();
    };
  }, []);

  return { toasts, showToast, dismissToast };
}
