'use client';

import css from './FiltersModal.module.css';
import type { Option } from '@/types/filter';
import { FiltersForm } from '../FiltersForm/FiltersForm';

type FiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Option[];
  ingredients: Option[];
};

export function FiltersModal({
  isOpen,
  onClose,
  categories,
  ingredients,
}: FiltersModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={css.modalBackdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={css.modal}>
        <div className={css.modalHeader}>
          <button
            type="button"
            className={css.closeButton}
            onClick={onClose}
            aria-label="Close filters"
          >
            <span className={css.closeButtonText}>Filters</span>
            <svg className={css.closeIcon} width="24" height="24">
              <use href="/Sprite.svg#icon-Notificationserror" />
            </svg>
          </button>
        </div>

        <FiltersForm
          categories={categories}
          ingredients={ingredients}
          onAfterReset={onClose} // close modal after reset
        />
      </div>
    </div>
  );
}

// ToDo: The modal should appear droping down starting from Filters toggle
