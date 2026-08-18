import { Button } from "@c/lib/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@c/lib/shadcn/components/ui/dialog";
import type { DefaultModalProps } from "@c/types/modalTypes";
import { useEffect, useState } from "react";

export interface ConfirmModalI extends Omit<
  DefaultModalProps,
  "formProps" | "children" | "setIsOpen"
> {
  onConfirm: () => void;
  onClose: () => void;
  modalDetails?: ConfirmModalDetailsI;
}

export interface ConfirmModalDetailsI {
  title?: string;
  description?: string;
}
export default function ConfirmModal({
  isOpen,
  onOpenChange,
  showCloseButton = false,
  modalDetails = {
    title: "Are you sure you want to proceed?",
    description: undefined,
  },
  onConfirm,
  onClose,
}: ConfirmModalI) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleConfirm = () => {
    try {
      onConfirm();
    } finally {
      onClose();
      setIsModalOpen(false);
    }
  };
  const handleClose = () => {
    try {
      onClose();
    } catch (error) {
      setIsModalOpen(false);
    }
  };
  useEffect(() => setIsModalOpen(isOpen), [isOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-5 rounded-2xl p-6 shadow-2xl sm:max-w-md"
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="gap-2">
          <DialogTitle className="text-lg font-semibold">
            {modalDetails.title}
          </DialogTitle>
          {modalDetails.description && (
            <DialogDescription className="leading-relaxed">
              {modalDetails.description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => handleConfirm()}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
