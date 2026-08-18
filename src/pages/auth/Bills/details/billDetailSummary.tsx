import { useMemo } from "react";
import type { TransactionSummaryI } from "@c/types/transactionTypes";
import { currency_formatter, date_formatter } from "@c/utils/utilities.util";

const StatCell = ({ label, value }: { label: string; value: string }) => (
  <div className="px-6 py-4">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="mt-1.5 font-mono text-xl font-medium tracking-tight">
      {value}
    </div>
  </div>
);

interface BillDetailSummaryI {
  summary: TransactionSummaryI | null;
}

export default function BillDetailSummary({
  summary: rawSummary,
}: BillDetailSummaryI) {
  const summary = useMemo(() => {
    const lastPayment = rawSummary?.last_payment ?? null;

    return {
      totalPaid: rawSummary?.total_paid ?? 0,
      paymentsCount: rawSummary?.payments_count ?? 0,
      lastPaymentDate: lastPayment
        ? date_formatter(new Date(lastPayment.transaction_date))
        : "—",
      lastPaymentMode: lastPayment ? lastPayment.payment_mode.label : "",
    };
  }, [rawSummary]);

  return (
    <div className="grid grid-cols-1 border-t bg-muted/30 sm:grid-cols-3 sm:divide-x">
      <StatCell
        label="Total paid · all time"
        value={currency_formatter(summary.totalPaid)}
      />
      <StatCell label="Payments logged" value={String(summary.paymentsCount)} />
      <StatCell
        label={
          summary.lastPaymentMode
            ? `Last payment · via ${summary.lastPaymentMode}`
            : "Last payment"
        }
        value={summary.lastPaymentDate}
      />
    </div>
  );
}
