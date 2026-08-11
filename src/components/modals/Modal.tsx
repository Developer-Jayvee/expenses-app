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
  header?: string;
  showCloseButton?: boolean;
}
export default function Modal({ showCloseButton = true, header }: ModalI) {
  const { isOpen, onClose } = useModal();
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
        {header && <DialogHeader>{header}</DialogHeader>}
        <div className="">
          <form>
            <DialogFooter>
              <DialogClose
                hidden={!showCloseButton}
                render={<Button variant="outline">Close</Button>}
              />
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
