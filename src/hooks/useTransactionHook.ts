import type { UndoToastOptionsI } from "@c/types/toastTypes";
import {
  TRANSACTION_DELETE_WINDOW_MS,
  type TransactionResourceI,
} from "@c/types/transactionTypes";
import { useState } from "react";
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
  const [pendingDeleteIds, setPendingDeleteIds] = useState<
    Set<string | number>
  >(new Set());

  const getTransactions = async (id: string) => {
    const response = await userTransactions_API(id);
    if (response) {
      setResource(response);
    } else setResource(null);
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
            setResource(
              (prev) =>
                prev?.filter((item) => item.id !== transaction.id) ?? prev,
            );
          })
          .finally(() => {
            setPendingDeleteIds((prev) => removePending(prev, transaction.id));
          });
      },
    });
  };

  return {
    resource,
    pendingDeleteIds,
    getTransactions,
    deleteTransaction,
  };
}
