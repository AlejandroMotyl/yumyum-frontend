'use client';

import { useEffect, useState } from 'react';
import css from './ConfirmationModal.module.css';
import { createPortal } from 'react-dom';

// ! ІКОНКА XРЕСТИКА, ПРИ ПОТРЕБІ ЗАМІНИТИ
// import { IoIosClose  } from "react-icons/io";

// !!ЩОБ КОМПОНЕНТ ПРАЦЮВАВ ОБОВ'ЯЗКОВО ПЕРЕДАТИ ЦІ ПРОПСИ
interface ConfirmationModalProps {
  title?: string; // ? Текст попередження (По замовчуванню 'Ви точно хочете вийти?')
  confirmButtonText?: string; // ? Текст підтвердження (По замовчуванню "Так")
  cancelButtonText?: string; // ? Текст відмовлення (По замовчуванню "Ні")
  onConfirm: () => void; // ? Функція що виконується у разі підтвердження
  onCancel: () => void; // ? Функція що виконується у разі відмовлення, закриття модального вікна
}

export default function ConfirmationModal({
  title = 'Ви точно хочете вийти?',
  confirmButtonText = 'Так',
  cancelButtonText = 'Ні',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  // ? Обробка escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onCancel]);
  // ? Обробка натиску на бекдроп
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(e) => handleBackdropClick(e)}
    >
      <div className={css.modal}>
        {/* <button className={css.closeButton}type='button' onClick={()=> {onCancel()}}> <IoIosClose  className={css.closeButtonIcon} size={48} /></button> */}
        <h2 className={css.title}>{title}</h2>
        <ul className={css.ulElement}>
          <li className={css.listElement}>
            <button
              className={css.buttonCancel}
              type="button"
              onClick={() => {
                onCancel();
              }}
            >
              {cancelButtonText}
            </button>
          </li>
          <li className={css.listElement}>
            <button
              className={css.buttonAccept}
              type="button"
              onClick={() => {
                onConfirm();
              }}
            >
              {confirmButtonText}
            </button>
          </li>
        </ul>
      </div>
    </div>,
    document.body,
  );
}
