
import type { ReactNode } from "react";
import Button from "./Button";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>

          <Button
            label="X"
            variant="secondary"
            onClick={onClose}
          />
        </div>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
