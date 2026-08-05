import { Button } from "@c/lib/shadcn/components/ui/button";
import { Dialog, DialogContent } from "@c/lib/shadcn/components/ui/dialog";
import {
  useEffect,
  useState,
  type Dispatch,
  type FormHTMLAttributes,
  type RefObject,
  type SetStateAction,
} from "react";

interface ButtonEventsI<R = void> {
  submitBtn: {
    type: "button" | "submit" | "reset";
    text: "Submit";
    handler: () => R;
  };
}
interface DefaultModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  formProps: FormHTMLAttributes<HTMLFormElement>;
  formRef: RefObject<HTMLFormElement | null>;
  buttonEvents?: ButtonEventsI;
}
export function DefaultModal({
  isOpen,
  setIsOpen,
  onOpenChange,
  children,
  showCloseButton = true,
  formProps = {},
  formRef,
  buttonEvents,
}: DefaultModalProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => setIsModalOpen(isOpen), [isOpen]);
  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={showCloseButton}>
        <form ref={formRef} {...formProps}>
          {children}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type={`${buttonEvents?.submitBtn?.type ?? "submit"}`}
              onClick={() =>
                buttonEvents?.submitBtn.handler
                  ? buttonEvents?.submitBtn.handler()
                  : undefined
              }
            >
              {" "}
              {buttonEvents?.submitBtn.text ?? "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
