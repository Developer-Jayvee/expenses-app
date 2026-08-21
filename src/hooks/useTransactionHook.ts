import type { UndoToastOptionsI } from "@c/types/toastTypes";
import {
  TRANSACTION_DELETE_WINDOW_MS,
  logPaymentSchema,
  type ExtendedLogPayment,
  type LogPaymentType,
  type TransactionListParamsI,
  type TransactionMetaI,
  type TransactionResourceI,
  type TransactionSummaryI,
} from "@c/types/transactionTypes";
import type { PostBillDataI } from "@c/types/billsTypes";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTransaction_API,
  deleteTransaction_API,
  userTransactions_API,
} from "./api/transaction-api";
import { extractRawHttpError } from "@c/utils/axios-error.util";
import {
  get_periods_for_date,
  get_transaction_date_bounds,
  today_date,
} from "@c/utils/utilities.util";

const removePending = (prev: Set<string | number>, id: string | number) => {
  const next = new Set(prev);
  next.delete(id);
  return next;
};

export default function useTransactionHook() {
  const [resource, setResource] = useState<TransactionResourceI[] | null>(null);
  const [meta, setMeta] = useState<TransactionMetaI | null>(null);
  const [summary, setSummary] = useState<TransactionSummaryI | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<
    Set<string | number>
  >(new Set());
  const lastFetchRef = useRef<{
    billId: string;
    params?: TransactionListParamsI;
  } | null>(null);

  const logForm = useForm<LogPaymentType>({
    resolver: zodResolver(logPaymentSchema),
    defaultValues: {
      payment_mode: "cash",
      transaction_date: today_date(),
      notes: "",
    },
  });

  /** The valid transaction-date window for logging a payment against `details`. */
  const getPaymentDateBounds = (
    details: PostBillDataI | null,
    paymentsCount: number,
  ): { min: string; max: string } | null =>
    details
      ? get_transaction_date_bounds(
          details.billing_date,
          paymentsCount,
          details.frequency,
          details.end_date,
        )
      : null;

  /**
   * Validates the currently selected `transaction_date` against the bill's
   * loggable-period window, setting a field error on `logForm` when it's out
   * of bounds. Returns the number of billing periods it covers on success.
   */
  const validateLogPaymentDate = (
    details: PostBillDataI | null,
    paymentsCount: number,
  ): { periods: number } | null => {
    const transactionDate = logForm.getValues("transaction_date");
    const dateBounds = getPaymentDateBounds(details, paymentsCount);

    if (dateBounds && transactionDate < dateBounds.min) {
      logForm.setError("transaction_date", {
        type: "validate",
        message:
          paymentsCount > 0
            ? "You have already logged a payment for the current billing period."
            : "Invalid transaction date",
      });
      return null;
    }
    if (dateBounds && transactionDate > dateBounds.max) {
      logForm.setError("transaction_date", {
        type: "validate",
        message:
          details && dateBounds.max === details.end_date
            ? "Transaction date can't be later than the bill's end date."
            : "Transaction date is too far in the future for this bill.",
      });
      return null;
    }

    const periods = details
      ? get_periods_for_date(
          details.billing_date,
          paymentsCount,
          details.frequency,
          transactionDate,
        )
      : 1;
    return { periods };
  };

  const logPayment = async (
    billId: string,
    periods: number,
  ): Promise<{ success: boolean; message: string }> => {
    const data: ExtendedLogPayment = {
      billsId: billId,
      amount: logForm.getValues("amount"),
      payment_mode: logForm.getValues("payment_mode"),
      transaction_date: logForm.getValues("transaction_date"),
      notes: logForm.getValues("notes"),
      periods,
    };

    try {
      const result = await createTransaction_API(data);
      if (result?.status) {
        return { success: true, message: "Payment logged successfully." };
      }
      const message = result?.message ?? "Failed to log payment.";
      logForm.setError("root.serverError", { type: "server", message });
      return { success: false, message };
    } catch (err) {
      const httpError = extractRawHttpError(err);
      const message = httpError?.message ?? "Failed to log payment.";
      Object.entries(httpError?.data ?? {}).forEach(([field, messages]) => {
        logForm.setError(field as keyof LogPaymentType, {
          type: "server",
          message: messages?.[0] ?? message,
        });
      });
      logForm.setError("root.serverError", { type: "server", message });
      return { success: false, message };
    }
  };

  const getTransactions = async (
    id: string,
    params?: TransactionListParamsI,
  ) => {
    lastFetchRef.current = { billId: id, params };
    const response = await userTransactions_API(id, params);
    if (response) {
      setResource(response.items);
      setMeta(response.meta);
      setSummary(response.summary);
    } else {
      setResource(null);
      setMeta(null);
      setSummary(null);
    }
    setPendingDeleteIds(new Set());
  };

  const deleteTransaction = (
    transaction: TransactionResourceI,
    showUndoToast: (options: UndoToastOptionsI) => void,
  ) => {
    setPendingDeleteIds((prev) => new Set(prev).add(transaction.id));

    showUndoToast({
      message: "Payment log deleted.",
      duration: TRANSACTION_DELETE_WINDOW_MS,
      onUndo: () => {
        setPendingDeleteIds((prev) => removePending(prev, transaction.id));
      },
      onExpire: () => {
        deleteTransaction_API(transaction.id)
          .then(() => {
            const last = lastFetchRef.current;
            if (last) return getTransactions(last.billId, last.params);
          })
          .finally(() => {
            setPendingDeleteIds((prev) => removePending(prev, transaction.id));
          });
      },
    });
  };

  return {
    resource,
    meta,
    summary,
    pendingDeleteIds,
    getTransactions,
    deleteTransaction,
    logForm,
    getPaymentDateBounds,
    validateLogPaymentDate,
    logPayment,
  };
}
