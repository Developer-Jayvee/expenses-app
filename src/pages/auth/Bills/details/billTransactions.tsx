import { useParams } from "react-router";
import TransactionTable from "../../Transactions/transactions-table";
import useTransactionHook from "@c/hooks/useTransactionHook";
import { useEffect } from "react";

export default function BillTransactions() {
  const { id } = useParams();
  if (!id) return null;

  const { resource, getTransactions } = useTransactionHook();

  useEffect(() => {
    if (id) getTransactions(id);
  }, [id]);
  return (
    <div className="w-full">
      <h3 className="font-bold px-3">Transactions</h3>
      <div>
        <div>{/* <input type="search" /> */}</div>
      </div>
      <div className="mt-4">
        <TransactionTable list={resource} />
      </div>
    </div>
  );
}
