import { IoCheckmarkCircle, IoCloseCircle, IoWarning } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import type {
  ToastNotificationStateI,
  ToastVariant,
} from "@c/types/toastTypes";

interface ToastListI {
  toasts: ToastNotificationStateI[];
  onDismiss: (id: number) => void;
}

const variantStyles: Record<
  ToastVariant,
  { bg: string; border: string; color: string; icon: React.ReactNode }
> = {
  success: {
    bg: "bg-[color-mix(in_oklch,var(--success-color),white_88%)]",
    border: "border-l-4 border-[var(--success-color)]",
    color: "text-[var(--success-color)]",
    icon: <IoCheckmarkCircle size={22} />,
  },
  danger: {
    bg: "bg-[color-mix(in_oklch,var(--danger-color),white_90%)]",
    border: "border-l-4 border-[var(--danger-color)]",
    color: "text-[var(--danger-color)]",
    icon: <IoCloseCircle size={22} />,
  },
  warning: {
    bg: "bg-[color-mix(in_oklch,var(--warning-color),white_88%)]",
    border: "border-l-4 border-[var(--warning-color)]",
    color: "text-[var(--warning-color)]",
    icon: <IoWarning size={22} />,
  },
};

export default function ToastList({ toasts, onDismiss }: ToastListI) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastNotificationStateI;
  onDismiss: () => void;
}) {
  const styles = variantStyles[toast.variant];
  return (
    <div
      className={`flex items-start gap-3 rounded-lg shadow-lg px-4 py-3 ${styles.bg} ${styles.border}`}
    >
      <div className={`shrink-0 mt-0.5 ${styles.color}`}>{styles.icon}</div>
      <div className="grow min-w-0">
        <p className="text-sm font-medium text-gray-800 break-words">
          {toast.message}
        </p>
        {toast.action && (
          <button
            type="button"
            className={`w-auto! mt-1 text-sm font-semibold cursor-pointer ${styles.color} hover:opacity-80`}
            onClick={() => {
              toast.action?.onClick();
              onDismiss();
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        className="w-auto! shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <IoMdClose size={18} />
      </button>
    </div>
  );
}
