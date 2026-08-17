import { RiResetRightFill } from "react-icons/ri";
import { FaRegCreditCard } from "react-icons/fa6";
import { IoPricetagOutline } from "react-icons/io5";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { useBillDetail } from "@c/context/providers/BillDetailsProvider";
import useReferenceHook from "@c/hooks/useReferenceHook";
import { date_formatter } from "@c/utils/utilities.util";
import type { DynamicDetailsI } from "@c/types/billsTypes";

const DynamicDetails = ({ children, type, value }: DynamicDetailsI) => {
  return (
    <div className="flex gap-5 items-center ">
      {children}
      <div>
        <small>{type}</small>
        <h4>{value}</h4>
      </div>
    </div>
  );
};

export default function BillDetailHeaders() {
  const { details } = useBillDetail();
  const { references } = useReferenceHook();
  return (
    <div className="grid grid-cols-2 w-full mt-4">
      <div className="leading-6">
        <div className="flex gap-2">
          <h2 className="text-3xl font-medium">{details?.name}</h2>
          <div className=" flex items-center rounded-lg p-1 text-sm px-2 text-red-600 bg-red-200">
            {details?.status}
          </div>
        </div>
        <small>Electricity Bill</small>
        <h2 className="text-3xl font-medium">
          P {Number(details?.amount).toLocaleString()}
        </h2>
        <p>{details?.description}</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px_1fr))]">
        <div className="grid grid-cols-2 grid-rows-2">
          <DynamicDetails
            type="Next Due Date"
            value={
              details?.next_date_at
                ? date_formatter(new Date(details?.next_date_at))
                : ""
            }
          >
            <IoCalendarNumberOutline size={20} />
          </DynamicDetails>
          <DynamicDetails
            type="Auto Pay"
            value={details?.is_autopay ? "On" : "Off"}
          >
            <RiResetRightFill size={20} />
          </DynamicDetails>

          <DynamicDetails
            type="Payment Method"
            value={
              details?.default_payment
                ? String(details?.default_payment)?.toUpperCase()
                : ""
            }
          >
            <FaRegCreditCard size={20} />
          </DynamicDetails>
          <DynamicDetails
            type="Category"
            value={
              references?.category?.find(({ key }) => key == details?.category)
                ?.label ?? ""
            }
          >
            <IoPricetagOutline size={20} />
          </DynamicDetails>
        </div>
      </div>
    </div>
  );
}
