import type { KPICardI, PillColor } from "./billDetails";
import { IoWalletOutline } from "react-icons/io5";
import { CiReceipt } from "react-icons/ci";
import { AiOutlinePieChart } from "react-icons/ai";
import { LuCalendarRange } from "react-icons/lu";

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
export default function BillDetailSummary() {
  return (
    <div className="border border-gray-500 rounded-md p-4 mt-5 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
      <KPICard type="Total Paid" value="P 22,000" description="All time">
        <CiReceipt size={30} />
      </KPICard>
      <KPICard
        type="Payments"
        value="P 21,000"
        description="Total Transactions"
      >
        <AiOutlinePieChart size={30} />
      </KPICard>
      <KPICard
        iconColor="warning"
        type="Last Payment"
        value="Aug 01, 2026"
        description="Via Gcash"
      >
        <LuCalendarRange size={30} />
      </KPICard>
    </div>
  );
}
