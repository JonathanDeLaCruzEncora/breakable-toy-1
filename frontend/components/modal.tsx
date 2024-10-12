"use client"; // Required for client-side hooks in Next.js

import { ReactNode, MouseEvent } from "react";
import { IoClose } from "react-icons/io5";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const handleBackgroundClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
    >
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg">
        <button
          className="absolute right-3 top-3 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200"
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
