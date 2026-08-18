import { useModal } from "@c/context/providers/ModalProvider";
import { Button } from "@c/lib/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@c/lib/shadcn/components/ui/dialog";

interface ModalConfirmI {
  header?: string | React.ReactNode;
  showCloseButton?: boolean;
}
export default function ModalConfirm({
  showCloseButton = false,
}: ModalConfirmI) {
  const { isOpen, onClose, modalSetting } = useModal();

  const modalSizes = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
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
        <DialogHeader>
          {modalSetting?.title && (
            <DialogTitle>{modalSetting?.title}</DialogTitle>
          )}
          {modalSetting?.description && (
            <DialogDescription>{modalSetting?.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="w-full">
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
                  Proceed
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
