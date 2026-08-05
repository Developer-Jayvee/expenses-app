import type { ModalDetailsI } from "@c/hooks/useConfirmModal";
import { createContext, useContext } from "react";

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

export class ModalContextService {
  public static confirmModal() {
    const context = useContext(ConfirmModalContext);
    if (!context) {
      alert("The component is outside the context");
      throw new Error("The component is outside the context");
    }
    return context;
  }
}
