import type { UndoToastOptionsI } from "@c/types/toastTypes";
import {
  TRANSACTION_DELETE_WINDOW_MS,
  type TransactionListParamsI,
  type TransactionMetaI,
  type TransactionResourceI,
  type TransactionSummaryI,
} from "@c/types/transactionTypes";
import { useRef, useState } from "react";
import {
  deleteTransaction_API,
  userTransactions_API,
} from "./api/transaction-api";

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
  };
}
