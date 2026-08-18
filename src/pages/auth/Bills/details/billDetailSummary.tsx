import { CiReceipt } from "react-icons/ci";
import { AiOutlinePieChart } from "react-icons/ai";
import { LuCalendarRange } from "react-icons/lu";
import { useMemo } from "react";
import type { KPICardI, PillColor } from "@c/types/billsTypes";
import type { TransactionSummaryI } from "@c/types/transactionTypes";
import { date_formatter } from "@c/utils/utilities.util";

const pillColor: Record<PillColor, { bg: string; color: string }> = {
  primary: {
    bg: "bg-blue-200",
    color: "text-blue-500",
  },
  danger: {
    bg: "bg-red-300",
    color: "text-red-500",
  },
  warning: {
    bg: "bg-yellow-200",
    color: "text-yellow-500",
  },
};
const KPICard = ({
  children,
  iconColor = "primary",
  type,
  value,
  description,
}: KPICardI) => {
  return (
    <div className="flex gap-2 place-items-center border-0 border-r-2 border-gray-500 ">
      <div className=" p-3">
        <div
          className={`
          
           w-14 h-14 flex items-center justify-center rounded-full ${pillColor[iconColor].bg} ${pillColor[iconColor].color}
        `}
        >
          {children}
        </div>
      </div>
      <div className="grow ">
        <small>{type}</small>
        <h4 className="font-medium text-2xl">{value}</h4>
        <small>{description}</small>
      </div>
    </div>
  );
};
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
        : "--",
      lastPaymentMode: lastPayment ? lastPayment.payment_mode.label : "",
    };
  }, [rawSummary]);

  return (
    <div className="border border-gray-500 rounded-md p-4 mt-5 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
      <KPICard
        type="Total Paid"
        value={`P ${summary.totalPaid.toLocaleString()}`}
        description="All time"
      >
        <CiReceipt size={30} />
      </KPICard>
      <KPICard
        type="Payments"
        value={String(summary.paymentsCount)}
        description="Total Transactions"
      >
        <AiOutlinePieChart size={30} />
      </KPICard>
      <KPICard
        iconColor="warning"
        type="Last Payment"
        value={summary.lastPaymentDate}
        description={
          summary.lastPaymentMode
            ? `Via ${summary.lastPaymentMode}`
            : "No payments yet"
        }
      >
        <LuCalendarRange size={30} />
      </KPICard>
    </div>
  );
}
