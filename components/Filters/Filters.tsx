'use client';

import { useState } from 'react';
import Container from '../Container/Container';
import css from './Filters.module.css';
import type { FilterProps } from '@/types/filter';

const Filters = ({
  totalRecipes,
  categories,
  ingredients,
  selectedCategory,
  selectedIngredient,
  onCategoryChange,
  onIngredientChange,
  onReset,
}: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <section className={css.filtersSection}>
      <Container>
        <div className={css.filtersWrapper}>
          <p className={css.amountRecipes}>{totalRecipes} recipes</p>{' '}
          <button
            className={css.filtersToggle}
            type="button"
            onClick={handleToggle}
          >
            <span>Filters</span>
            <svg width="24" height="24">
              <use href="/Sprite.svg#icon-Mailfilter"></use>
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Modal*/}
      {isOpen && (
        <div
          className={css.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className={css.modal}>
            <div className={css.modalHeader}>
              <button
                type="button"
                className={css.closeButton}
                onClick={handleClose}
                area-label="Close filters"
              >
                <span className={css.closeButtonText}>Filters</span>
                <svg width="24" height="24">
                  <use href="/Sprite.svg#icon-Notificationserror"></use>
                </svg>
              </button>
            </div>

            <div className={css.inputResetWrapper}>
              <label className={css.filtersField}>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Category
                  </option>
                  {categories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={css.filtersField}>
                <select
                  value={selectedIngredient}
                  onChange={(e) => onIngredientChange(e.target.value)}
                >
                  <option value="" disabled hidden>
                    Ingredient
                  </option>
                  {ingredients.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className={css.resetButton}
                onClick={() => {
                  onReset();
                  handleClose();
                }}
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Filters;

// ToDo: Desktop version
// Todo: Clean up test code
