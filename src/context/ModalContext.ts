import type { ModalDetailsI } from "@c/hooks/useConfirmModal";
import { createContext } from "react";

export interface ConfirmModalContextI {
  onOpen: () => void;
  onClose: () => void;
  confirmModalConfig: ({ title, description }: ModalDetailsI) => void;
  handleConfirm: (callback: () => void) => void;
}
export const ConfirmModalContext = createContext<ConfirmModalContextI>({
  onOpen: () => {},
  onClose: () => {},
  confirmModalConfig: () => {},
  handleConfirm: (callback: () => void) => callback(),
});
