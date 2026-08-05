import { BillsContext } from "@c/context/BillsProvider";
import { useContext, useEffect, useState } from "react";
import BillCard from "./bill-card";
import { ModalContextService } from "@c/context/ModalContext";

export default function BillTable() {
  const { bills, onDelete, onOpenUpdate } = useContext(BillsContext);
  const { onOpen, confirmModalConfig, handleConfirm } =
    ModalContextService.confirmModal();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const handleDelete = (id: string) => {
    onOpen();
    confirmModalConfig({
      title: "Are you sure you want to delete this bill?",
      description: "Once deleted, It will be permanently removed.",
    });
    setSelectedId(id);
  };
  useEffect(() => {
    if (selectedId) handleConfirm(() => onDelete(selectedId));
  }, [selectedId]);
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
      {bills.length > 0 ? (
        bills.map((item) => (
          <BillCard
            key={item.id}
            item={item}
            onDelete={() => handleDelete(item.id)}
            onUpdate={onOpenUpdate}
          />
        ))
      ) : (
        <small>No data found.</small>
      )}
    </div>
  );
}
