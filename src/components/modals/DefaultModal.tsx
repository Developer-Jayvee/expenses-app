import { Button } from "@c/lib/shadcn/components/ui/button";
import { Dialog, DialogContent } from "@c/lib/shadcn/components/ui/dialog";
import {
  useEffect,
  useState,
  type Dispatch,
  type FormHTMLAttributes,
  type SetStateAction,
} from "react";

interface DefaultModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onOpenChange: (isOpen: boolean) => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  formProps: FormHTMLAttributes<HTMLFormElement>;
}
export function DefaultModal({
  isOpen,
  setIsOpen,
  onOpenChange,
  children,
  showCloseButton = true,
  formProps = {},
}: DefaultModalProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => setIsModalOpen(isOpen), [isOpen]);
  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={showCloseButton}>
        <form {...formProps}>
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
            <Button variant="primary" type="submit">
              {" "}
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
