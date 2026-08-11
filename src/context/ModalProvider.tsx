import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ContextProvider, useContextProvider } from "./BaseContextProvider";
import Modal from "@c/components/modals/Modal";

interface ModalContextI {
  onOpen: () => void;
  onClose: () => void;
  isOpen?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  showCloseButton?: (show: boolean) => void;
}
export const ModalContext = createContext<ModalContextI | null>(null);

export const useModal = () => useContextProvider<ModalContextI>(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsModalOpen] = useState<boolean>(false);

  const modalValue = useMemo<ModalContextI>(
    () => ({
      isOpen,
      onClose: () => setIsModalOpen(false),
      onOpen: () => setIsModalOpen(true),
    }),
    [isOpen],
  );

  return (
    <ContextProvider<ModalContextI | null>
      context={ModalContext}
      values={modalValue}
    >
      <>{children}</>
      <Modal />
    </ContextProvider>
  );
};
