import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";

interface ActionConfirmationModalProps {
  title: string;
  description: string;
  children: (show: (callback: () => void) => (e: React.MouseEvent) => void) => ReactNode;
  confirmText?: string;
  cancelText?: string;
  needAction?: boolean;
}

export function ActionConfirmationModal({
  title,
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  needAction = true,
}: ActionConfirmationModalProps) {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState<(() => void) | null>(null);

  const show = (callback: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(true);
    setCallback(() => callback);
  };

  const hide = () => {
    setCallback(null);
    setOpen(false);
  };

  const confirm = () => {
    if (callback) {
      callback();
    }
    hide();
  };

  return (
    <div>
      {children(show)}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-justify pt-5">{description}</DialogDescription>
          </DialogHeader>
          {needAction && (
            <DialogFooter>
              <Button variant="outline" onClick={hide}>
                {cancelText}
              </Button>
              <Button variant="default" onClick={confirm}>
                {confirmText}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}