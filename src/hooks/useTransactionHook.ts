import type { TransactionResourceI } from "@c/types/transactionTypes";
import { useState } from "react";
import { userTransactions_API } from "./api/transaction-api";

export default function useTransactionHook() {
  const [resource, setResource] = useState<TransactionResourceI[] | null>(null);

  const getTransactions = async (id: string) => {
    const response = await userTransactions_API(id);
    if (response) {
      setResource(response);
    } else setResource(null);
  };

  return {
    resource,
    getTransactions,
  };
}
