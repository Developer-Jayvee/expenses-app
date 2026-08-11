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
      <DialogContent
        className="flex max-h-[90vh] flex-col sm:max-w-xl"
        showCloseButton={showCloseButton}
      >
        <form
          ref={formRef}
          {...formProps}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto my-6  p-4">
            {children}
          </div>
          <div className="grid grid-cols-[auto_auto] place-content-end gap-2 mt-1">
            <Button
              className="px-6!"
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                {
                  children;
                }
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="px-6!"
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
