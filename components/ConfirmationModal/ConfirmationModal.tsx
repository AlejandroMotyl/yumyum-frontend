'use client';

import { useEffect, useState } from 'react';
import css from './ConfirmationModal.module.css';
import { createPortal } from 'react-dom';

// !!ЩОБ КОМПОНЕНТ ПРАЦЮВАВ ОБОВ'ЯЗКОВО ПЕРЕДАТИ ЦІ ПРОПСИ
interface ConfirmationModalProps {
  title?: string; // ? Текст попередження (По замовчуванню 'Ви точно хочете вийти?')
  paragraph?: string; // ? Додатковий текст попередження
  confirmButtonText?: string; // ? Текст кнопки
  confirmSecondButtonText?: string; // ? Текст другої кнопки
  onConfirm: () => void; // ? Функція що виконується у разі підтвердження
  onConfirmSecond: () => void; // ? Функція що виконується у разі підтвердження
  confirmButtonVariant?: 'Login' | 'Logout'; //? Перша кнопка стилі
  confirmSecondButtonVariant?: 'Cancel' | 'Register' | 'GoToMyProfile'; //? Друга кнопка стилі
  reverseOrder?: boolean; // ? Чи міняти порядок кнопок місцями - потрібно тільки для Login Register модалки
}

export default function ConfirmationModal({
  title,
  paragraph,
  confirmButtonText,
  confirmSecondButtonText,
  onConfirm,
  onConfirmSecond,
  confirmButtonVariant,
  confirmSecondButtonVariant,
  reverseOrder,
}: ConfirmationModalProps) {
  // ? Обробка escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onConfirmSecond();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onConfirmSecond]);
  // ? Обробка натиску на бекдроп
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onConfirmSecond();
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
      <div
        className={`${css.modal} ${
          confirmButtonVariant === 'Logout' &&
          confirmSecondButtonVariant === 'Cancel'
            ? css.modalLogoutCancel
            : ''
        }
          ${confirmSecondButtonVariant === 'GoToMyProfile' ? css.modalGoToMyProfile : ''}`}
      >
        <button
          className={css.confirmSecondButton}
          type="button"
          onClick={() => {
            onConfirmSecond();
          }}
        >
          <svg stroke="currentColor">
            <use href={'/sprite-new.svg#icon-close-medium'} />
          </svg>
        </button>
        <h2 className={css.title}>{title}</h2>
        <p className={css.paragraph}>{paragraph}</p>
        <ul
          className={`${css.ulElement} ${
            reverseOrder ? css.ulElementReverse : ''
          }`}
        >
          <li className={css.listElement}>
            <button
              className={`${css.buttonCancel} ${css[`btn${confirmSecondButtonVariant}`]}`}
              type="button"
              onClick={() => {
                onConfirmSecond();
              }}
            >
              {confirmSecondButtonText}
            </button>
          </li>
          {confirmSecondButtonVariant === 'GoToMyProfile' ? null : (
            <li className={css.listElement}>
              <button
                className={`${css.buttonAccept} ${css[`btn${confirmButtonVariant}`]}`}
                type="button"
                onClick={() => {
                  onConfirm();
                }}
              >
                {confirmButtonText}
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
//How to use - Header example:
// <ConfirmationModal
//          onConfirm={() => {
//            setIsModalOpen(false);
//            handleLogout();
//          }}
//          title="Are you sure?"
//          paragraph="We will miss you!"
//          confirmSecondButtonText="Cancel"
//          confirmSecondButtonVariant="Cancel"
//          confirmButtonText="Logout"
//          confirmButtonVariant="Logout"
//          onConfirmSecond={() => setIsModalOpen(false)}
//        />
