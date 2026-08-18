import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ModalContextService } from "@c/context/ModalContext";
import { useBillContext } from "@c/context/providers/BillsProvider";

export default function useBillActionsHook() {
  const { onDelete } = useBillContext();
  const { onOpen, confirmModalConfig, handleConfirm } =
    ModalContextService.confirmModal();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleOpen = (id: string) => navigate(`${id}`);

  return { handleDelete, handleOpen };
}
