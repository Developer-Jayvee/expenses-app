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
  useEffect(() => {
    console.log(isModalOpen);
  }, [isModalOpen]);
  useEffect(() => setIsModalOpen(isOpen), [isOpen]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            {modalDetails.title}
          </DialogTitle>
        </DialogHeader>
        {modalDetails.description && (
          <DialogDescription className="text-center">
            {modalDetails.description}
          </DialogDescription>
        )}
        <div className="flex gap-2 mt-5">
          <Button variant="ghost" type="button" onClick={() => handleClose()}>
            Close
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => handleConfirm()}
          >
            {" "}
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
