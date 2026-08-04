import type { PostBillDataI } from "@c/types/billsTypes";
import { date_formatter } from "@c/utils/utilities.util";

interface BillCardI {
  item : Partial<PostBillDataI>;
  onDelete: (id : string) => void;
  onUpdate : (id : string) => void;
}
export default function BillCard({
  item, onDelete, onUpdate
}: BillCardI) {
  const date = date_formatter((item?.billing_date ?? new Date()) as Date);
  return (
    <div className="bills-card p-4   bg-white rounded-2xl font-inter shadow-md">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{item?.name}</h3>
          <div className="rounded-lg p-1 text-sm px-3 text-red-600 bg-red-200">
            <p className="font-medium">{status ?? "Inactive"}</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-3xl">
            {" "}
            &#8369; {Number(item.amount ?? 0).toFixed(2)}
          </h3>
        </div>
        <div className="grid grid-cols-2 text-sm">
          <div>
            <h4 className="small font-bold block">MONTHLY DEADLINE</h4>
            <p>Day 1</p>
          </div>
          <div>
            <h4 className="small font-bold block">END DATE</h4>
            <p>{date}</p>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <button className="bg-gray-300" onClick={() => item?.id ? onUpdate(item?.id) : undefined}>Edit</button>
          <button className="bg-gray-300" onClick={() => item?.id ? onDelete(item?.id) : undefined}>Delete</button>
        </div>
      </div>
    </div>
  );
}
