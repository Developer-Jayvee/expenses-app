import type { Dispatch, FormHTMLAttributes, SetStateAction } from "react";

export interface DefaultModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  formProps: FormHTMLAttributes<HTMLFormElement>;
}
