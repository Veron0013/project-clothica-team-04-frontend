"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import style from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabelledby?: string;
  ariaLabel?: string;
  closeOnBackdropClick?: boolean;
}

export default function Modal({
  open,
  onClose,
  children,
  ariaLabelledby,
  ariaLabel,
  closeOnBackdropClick = true,
}: ModalProps) {
  // SSR guard + повага до open
  if (typeof document === "undefined" || !open) return null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    // блок скролу тільки коли модалка відкрита
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = prev || "unset";
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdropClick) return;
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div
      className={style.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      onClick={handleBackdropClick}
    >
      <div className={style.modal}>{children}</div>
    </div>,
    document.body
  );
}
