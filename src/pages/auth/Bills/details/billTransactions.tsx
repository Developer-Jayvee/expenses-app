import { useOutletContext } from "react-router";
import TransactionTable from "../../Transactions/transactions-table";
import type { TransactionOutletI } from "@c/types/transactionTypes";

export default function BillTransactions() {
  const { list: resource } = useOutletContext<TransactionOutletI>();
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
