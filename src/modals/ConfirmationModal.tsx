import "../styles/Modal.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose = () => {},
  onConfirm,
  message,
  confirmText = "OK",
  description = "",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <p>{description}</p>
        <div className="modal-actions">
          <button className="modal-button cancel-button" onClick={onClose}>{cancelText}</button>
          <button className="modal-button confirm-button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
