import { BillsContext } from "@c/context/BillsProvider";
import { useContext } from "react";
import BillCard from "./bill-card";

export default function BillTable() {
  const { bills, onDelete , onOpenUpdate} = useContext(BillsContext);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
      {bills.length > 0 ? (
        bills.map((item) => (
          <BillCard
            key={item.id}
            item={item}
            onDelete={onDelete}
            onUpdate={onOpenUpdate}
          />
        ))
      ) : (
        <small>No data found.</small>
      )}
    </div>
  );
}
