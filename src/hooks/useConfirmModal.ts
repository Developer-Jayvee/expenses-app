import { useState } from "react";

export interface ModalDetailsI {
  title: string;
  description?: string;
}
export default function useConfirmModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalDetails, setModalDetails] = useState<ModalDetailsI>({
    title: "",
    description: undefined,
  });
  const [isShowCloseBtn, setIsShowCloseBtn] = useState<boolean>(false);
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = (callback: () => void) => {
    setConfirmCallback(() => callback);
  };
  const onOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const showCloseButton = (show: boolean) => {
    setIsShowCloseBtn(show);
  };

  const handleModalDetails = ({ title, description }: ModalDetailsI) => {
    setModalDetails({ title, description });
  };

  return {
    isOpen,
    modalDetails,
    isShowCloseBtn,
    showCloseButton,
    onClose,
    onOpen,
    onOpenChange,
    handleModalDetails,
    handleConfirm,
    confirmCallback,
  };
}
