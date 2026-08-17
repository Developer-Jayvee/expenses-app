import ConfirmModal from "@c/components/modals/ConfirmModal";
import useConfirmModal from "@c/hooks/useConfirmModal";
import { useMemo } from "react";
import {
  ConfirmModalContext,
  type ConfirmModalContextI,
} from "../ModalContext";

interface ConfirmModalProviderI {
  children: React.ReactNode;
}
export default function ConfirmModalProvider({
  children,
}: ConfirmModalProviderI) {
  const {
    isOpen,
    onOpenChange,
    modalDetails,
    onClose,
    onOpen: confirmModalOpen,
    handleModalDetails,
    handleConfirm,
    confirmCallback,
  } = useConfirmModal();

  const provider = useMemo<ConfirmModalContextI>(
    () => ({
      onOpen: confirmModalOpen,
      onClose,
      confirmModalConfig: handleModalDetails,
      handleConfirm,
    }),
    [isOpen, modalDetails],
  );
  return (
    <ConfirmModalContext.Provider value={provider}>
      <>
        {children}
        <ConfirmModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          modalDetails={modalDetails}
          onConfirm={() => confirmCallback()}
          onClose={onClose}
        />
      </>
    </ConfirmModalContext.Provider>
  );
}
