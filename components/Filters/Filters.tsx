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
          <div
            className={`${css.filtersPanel} ${isOpen ? css.filtersPanelOpen : ''}`}
          >
            <div className={css.resetWrapper}>
              <button
                type="button"
                className={css.resetButton}
                onClick={onReset}
              >
                Reset filters
              </button>
              <div className={css.resetDecorator}></div>
            </div>
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
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Filters;

// ToDo: Desktop version
// Todo: underline element for Reset Filters
// Todo: icon change on toggle
