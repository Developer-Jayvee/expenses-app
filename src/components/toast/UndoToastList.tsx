import type { ToastStateI } from "@c/types/toastTypes";

interface UndoToastListI {
  toasts: ToastStateI[];
  onUndo: (id: number) => void;
}

export default function UndoToastList({ toasts, onUndo }: UndoToastListI) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col-reverse gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <UndoToast
          key={toast.id}
          toast={toast}
          onUndo={() => onUndo(toast.id)}
        />
      ))}
    </div>
  );
}

function UndoToast({
  toast,
  onUndo,
}: {
  toast: ToastStateI;
  onUndo: () => void;
}) {
  const totalSeconds = Math.ceil(toast.duration / 1000);
  const progress =
    totalSeconds > 0 ? (toast.remaining / totalSeconds) * 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-lg bg-[var(--sidebar-bg)] text-white shadow-lg">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="text-sm">{toast.message}</span>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400 tabular-nums">
            {toast.remaining}s
          </span>
          <button
            type="button"
            className="text-sm font-semibold cursor-pointer text-[var(--primary-color)] hover:opacity-80"
            onClick={onUndo}
          >
            Undo
          </button>
        </div>
      </div>
      <div
        className="h-1 bg-[var(--primary-color)] transition-[width] duration-1000 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
