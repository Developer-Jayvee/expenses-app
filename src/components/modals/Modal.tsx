import { useModal } from "@c/context/ModalProvider";
import { Button } from "@c/lib/shadcn/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@c/lib/shadcn/components/ui/dialog";

interface ModalI {
  header?: string;
  showCloseButton?: boolean;
}
export default function Modal({ showCloseButton = false }: ModalI) {
  const { isOpen, onClose, modalSetting } = useModal();
  const ModalChildren = modalSetting?.content;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent showCloseButton={showCloseButton}>
        {modalSetting?.header && (
          <DialogHeader>
            <DialogTitle>{modalSetting?.header}</DialogTitle>
          </DialogHeader>
        )}
        <div className="">
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
