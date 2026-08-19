import BillCard from "./bill-card";
import type { PostBillDataI } from "@c/types/billsTypes";

interface BillCardsGridI {
  bills: Array<PostBillDataI>;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BillTable({ bills, onOpen, onDelete }: BillCardsGridI) {
  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-16 text-center">
        <span className="text-sm font-semibold">No bills found</span>
        <span className="text-sm text-muted-foreground">
          Try a different search or filter.
        </span>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      {bills.map((item) => (
        <BillCard
          key={item.id}
          item={item}
          onDelete={() => onDelete(item.id)}
          onOpen={() => onOpen(item.id)}
        />
      ))}
    </div>
  );
}
