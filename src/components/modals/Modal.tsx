import { useModal } from "@c/context/ModalProvider";
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
        className={`flex max-h-[90vh] flex-col sm:max-w-${modalSetting?.size}`}
        showCloseButton={showCloseButton}
      >
        {modalSetting?.header && (
          <DialogHeader>{modalSetting?.header}</DialogHeader>
        )}
        <div className="w-full">
          {ModalChildren || ""}
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
                  onClick={() => modalSetting?.submitEvent?.()}
                >
                  {" "}
                  Submit
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
