import { useModal } from "@c/context/providers/ModalProvider";
import { Button } from "@c/lib/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@c/lib/shadcn/components/ui/dialog";

interface ModalI {
  header?: string | React.ReactNode;
  showCloseButton?: boolean;
}
export default function Modal({ showCloseButton = false }: ModalI) {
  const { isOpen, onClose, modalSetting } = useModal();
  const ModalChildren = modalSetting?.content;
  if (!modalSetting?.content) return null;

  const modalSizes = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className={`flex max-h-[90vh] flex-col ${modalSizes[modalSetting?.size ?? "md"]}`}
        showCloseButton={showCloseButton}
      >
        {modalSetting?.header && (
          <DialogHeader>{modalSetting?.header}</DialogHeader>
        )}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto mb-4  p-4">
            {ModalChildren || ""}
          </div>
          {modalSetting?.showFooter && (
            <DialogFooter>
              <div className="grid grid-cols-[auto_auto] place-content-end gap-2 mt-1">
                <DialogClose
                  render={
                    <Button onClick={() => onClose()} variant="outline">
                      Close
                    </Button>
                  }
                />
                {modalSetting?.submitEvent && (
                  <Button
                    className="px-6!"
                    variant="primary"
                    type="submit"
                    onClick={() => {
                      try {
                        modalSetting?.submitEvent?.();
                      } finally {
                        onClose();
                      }
                    }}
                  >
                    {" "}
                    Submit
                  </Button>
                )}
              </div>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
