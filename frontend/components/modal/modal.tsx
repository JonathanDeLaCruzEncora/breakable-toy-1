import { ReactNode, MouseEvent } from "react";
import { IoClose } from "react-icons/io5";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};

/**
 * Modal component to display content in a modal dialog.
 *
 * @param {ModalProps} props - The component props.
 * @param {function} props.onClose - The function to close the modal.
 * @param {ReactNode} props.children - The content to display inside the modal.
 */
const Modal = ({ onClose, children }: ModalProps) => {
  /**
   * Handle background click to close the modal if the background is clicked.
   *
   * @param {MouseEvent<HTMLDivElement>} e - The mouse event.
   */
  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onMouseDown={handleBackgroundClick}
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-lg dark:bg-slate-800">
        <button
          className="absolute right-3 top-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 dark:text-white dark:hover:bg-slate-600 dark:hover:text-white dark:active:bg-slate-700 dark:active:text-white"
          onClick={onClose}
        >
          <IoClose className="p-1" size={42} />
        </button>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
