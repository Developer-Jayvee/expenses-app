import { useOutletContext } from "react-router";
import TransactionTable from "../../Transactions/transactions-table";
import TransactionsPagination from "../../Transactions/transactions-pagination";
import type { TransactionOutletI } from "@c/types/transactionTypes";
import { currency_formatter } from "@c/utils/utilities.util";

export default function BillTransactions() {
  const {
    list: resource,
    onDelete,
    pendingDeleteIds,
    meta,
    summary,
    onPageChange,
  } = useOutletContext<TransactionOutletI>();

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b px-5 py-3.5">
        <div className="flex items-baseline gap-2.5">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Total transactions
          </span>
          <span className="font-mono text-lg font-medium tracking-tight">
            {currency_formatter(summary?.total_paid ?? 0)}
          </span>
          <span className="text-xs text-muted-foreground">
            across {summary?.payments_count ?? 0} payments
          </span>
        </div>
        {meta && (
          <span className="text-xs text-muted-foreground">
            Showing {(meta.current_page - 1) * meta.per_page + 1}–
            {Math.min(meta.current_page * meta.per_page, meta.total)} of{" "}
            {meta.total}
          </span>
        )}
      </div>
      <TransactionTable
        list={resource}
        onDelete={onDelete}
        pendingDeleteIds={pendingDeleteIds}
      />
      <TransactionsPagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
