"use client";

import { useEffect } from "react";
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
  // Закриваємо по Esc + лочимо скрол body

  useEffect(() => {
    if (!open) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    open ? (
      <div
        className={style.backdrop}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledby}
        aria-label={ariaLabel}
        onMouseDown={(e) => {
          if (!closeOnBackdropClick) return;

          if (e.currentTarget === e.target) onClose();
        }}
      >
        <div className={style.content}>{children}</div>
      </div>
    ) : null,

    document.body
  );
}
