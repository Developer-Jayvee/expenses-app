import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastStateI, UndoToastOptionsI } from "@c/types/toastTypes";

const DEFAULT_DURATION = 10000;

export default function useUndoToast() {
  const [toasts, setToasts] = useState<ToastStateI[]>([]);
  const timers = useRef(
    new Map<
      number,
      {
        interval: ReturnType<typeof setInterval>;
        timeout: ReturnType<typeof setTimeout>;
      }
    >(),
  );
  const idRef = useRef(0);

  const clearTimers = (id: number) => {
    const entry = timers.current.get(id);
    if (entry) {
      clearInterval(entry.interval);
      clearTimeout(entry.timeout);
      timers.current.delete(id);
    }
  };

  const dismiss = useCallback((id: number) => {
    clearTimers(id);
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showUndoToast = useCallback((options: UndoToastOptionsI) => {
    const id = ++idRef.current;
    const duration = options.duration ?? DEFAULT_DURATION;

    setToasts((prev) => [
      ...prev,
      { ...options, id, duration, remaining: Math.ceil(duration / 1000) },
    ]);

    const interval = setInterval(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id
            ? { ...toast, remaining: Math.max(toast.remaining - 1, 0) }
            : toast,
        ),
      );
    }, 1000);

    const timeout = setTimeout(() => {
      clearTimers(id);
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      options.onExpire?.();
    }, duration);

    timers.current.set(id, { interval, timeout });
  }, []);

  const undo = useCallback((id: number) => {
    setToasts((prev) => {
      const toast = prev.find((item) => item.id === id);
      toast?.onUndo?.();
      return prev.filter((item) => item.id !== id);
    });
    clearTimers(id);
  }, []);

  useEffect(() => {
    const timerMap = timers.current;
    return () => {
      timerMap.forEach(({ interval, timeout }) => {
        clearInterval(interval);
        clearTimeout(timeout);
      });
      timerMap.clear();
    };
  }, []);

  return { toasts, showUndoToast, undo, dismiss };
}
