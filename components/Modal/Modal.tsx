'use client';

import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import { useEffect, useState } from 'react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export default function Modal({ children, onClose, className }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, []);

  function handleClose(e: React.MouseEvent<HTMLElement>) {
    const clickedBackdrop = e.target === e.currentTarget;

    if (clickedBackdrop) {
      onClose();
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={handleClose}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={`${css.modal} ${className || ''}`}>
        <button className={css.closeButton} type="button" onClick={onClose}>
          <svg stroke="var(--black)" width="24" height="24">
            <use href="/sprite.svg#icon-Controlsclose"></use>
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
