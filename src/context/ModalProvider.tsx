import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ContextProvider, useContextProvider } from "./BaseContextProvider";
import Modal from "@c/components/modals/Modal";

interface ModalSettingI {
  header?: string;
  type?: ModalTypes;
  content?: React.ReactNode | null;
  submitEvent?: () => void;
}
interface ModalContextI {
  onOpen: () => void;
  onClose: () => void;
  isOpen?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  showCloseButton?: (show: boolean) => void;
  configureModal?: ({ header, type, content }: ModalSettingI) => void;
  modalSetting?: ModalSettingI;
}
type ModalTypes = "general" | "confirm";
export const ModalContext = createContext<ModalContextI | null>(null);

export const useModal = () => useContextProvider<ModalContextI>(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalSetting, setModalSetting] = useState<ModalSettingI>({
    header: "",
    type: "general",
    content: null,
    submitEvent: undefined,
  });
  const modalValue = useMemo<ModalContextI>(
    () => ({
      isOpen,
      onClose: () => setIsModalOpen(false),
      onOpen: () => setIsModalOpen(true),
      modalSetting,
      configureModal: ({
        header,
        type = "general",
        content,
        submitEvent = undefined,
      }: ModalSettingI) => {
        setModalSetting((prev) => ({
          ...prev,
          header,
          type,
          content,
          submitEvent,
        }));
      },
    }),
    [isOpen, modalSetting],
  );

  return (
    <ContextProvider<ModalContextI | null>
      context={ModalContext}
      values={modalValue}
    >
      <>{children}</>
      {modalSetting.type === "general" ? <Modal /> : <></>}
    </ContextProvider>
  );
};
