import DropMenu from "@c/components/ui/DropMenu";
import type { PostBillDataI } from "@c/types/billsTypes";
import { date_formatter } from "@c/utils/utilities.util";
import { BsThreeDots } from "react-icons/bs";
interface BillCardI {
  item: Partial<PostBillDataI>;
  onDelete: () => void;
  onOpen: () => void;
}
export default function BillCard({ item, onDelete, onOpen }: BillCardI) {
  const date = date_formatter((item?.billing_date ?? new Date()) as Date);
  return (
    <div className="bills-card p-4   bg-white rounded-2xl font-inter shadow-md hover:scale-101 transition-all cursor-pointer">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="">
            <h3 className="font-bold inline-block mr-2">{item?.name}</h3>
            <div className="inline-block rounded-lg p-1 text-sm px-2 text-red-600 bg-red-200">
              {item.status}
            </div>
          </div>
          <div className="grow flex justify-end">
            <div className="">
              <DropMenu
                options={[
                  {
                    items: [
                      {
                        label: "Open",
                        event: () => onOpen(),
                      },
                      {
                        label: "Delete",
                        event: () => onDelete(),
                      },
                    ],
                  },
                ]}
              >
                <BsThreeDots />
              </DropMenu>
            </div>
          </div>
          <div></div>
        </div>
        <div>
          <h3 className="font-bold text-3xl">
            {" "}
            &#8369; {Number(item.amount ?? 0).toLocaleString()}
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
      </div>
    </div>
  );
}
