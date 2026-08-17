import type { UndoToastOptionsI } from "@c/types/toastTypes";
import type { TransactionResourceI } from "@c/types/transactionTypes";
import { useState } from "react";
import {
  deleteTransaction_API,
  userTransactions_API,
} from "./api/transaction-api";

const sortByOrder = (list: TransactionResourceI[]) =>
  [...list].sort((a, b) => a.order - b.order);

export default function useTransactionHook() {
  const [resource, setResource] = useState<TransactionResourceI[] | null>(null);

  const getTransactions = async (id: string) => {
    const response = await userTransactions_API(id);
    if (response) {
      setResource(response);
    } else setResource(null);
  };

  const restoreTransaction = (transaction: TransactionResourceI) => {
    setResource((prev) => {
      if (!prev) return [transaction];
      if (prev.some((item) => item.id === transaction.id)) return prev;
      return sortByOrder([...prev, transaction]);
    });
  };

  const deleteTransaction = (
    transaction: TransactionResourceI,
    showUndoToast: (options: UndoToastOptionsI) => void,
  ) => {
    setResource(
      (prev) => prev?.filter((item) => item.id !== transaction.id) ?? prev,
    );

    showUndoToast({
      message: "Payment log deleted.",
      duration: 10000,
      onUndo: () => restoreTransaction(transaction),
      onExpire: () => {
        deleteTransaction_API(transaction.id).catch(() =>
          restoreTransaction(transaction),
        );
      },
    });
  };

  return {
    resource,
    getTransactions,
    deleteTransaction,
  };
}
