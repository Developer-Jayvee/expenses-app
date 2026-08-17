import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ContextProvider, useContextProvider } from "./BaseContextProvider";
import Modal from "@c/components/modals/Modal";
import ModalConfirm from "@c/components/modals/ModalConfirm";

type ModalSizes = "xl" | "lg" | "md" | "sm";
interface ModalSettingI {
  header?: string | React.ReactNode;
  title?: string;
  description?: string;
  type?: ModalTypes;
  content?: React.ReactNode | null;
  submitEvent?: () => void;
  size?: ModalSizes;
  showFooter?: boolean;
}
interface ModalContextI {
  onOpen: () => void;
  onClose: () => void;
  isOpen?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
  showCloseButton?: (show: boolean) => void;
  configureModal?: ({
    header,
    title,
    description,
    type,
    content,
    showFooter,
  }: ModalSettingI) => void;
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
    size: "md",
    showFooter: true,
  });

  const configureSettings = ({
    header,
    type = "general",
    content,
    title,
    description,
    size = "md",
    submitEvent = undefined,
    showFooter = true,
  }: ModalSettingI) => {
    setModalSetting((prev) => ({
      ...prev,
      header,
      type,
      content,
      size,
      submitEvent,
      title,
      description,
      showFooter,
    }));
  };
  const modalValue = useMemo<ModalContextI>(
    () => ({
      isOpen,
      modalSetting,
      onClose: () => setIsModalOpen(false),
      onOpen: () => setIsModalOpen(true),
      configureModal: configureSettings,
    }),
    [isOpen, modalSetting],
  );
  let selectedModal = null;
  switch (modalSetting.type) {
    case "general":
      selectedModal = <Modal />;
      break;
    case "confirm":
      selectedModal = <ModalConfirm />;
      break;
  }
  return (
    <ContextProvider<ModalContextI | null>
      context={ModalContext}
      values={modalValue}
    >
      <>{children}</>
      {selectedModal || ""}
    </ContextProvider>
  );
};
