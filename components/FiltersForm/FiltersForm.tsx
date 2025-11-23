'use client';

import css from './FiltersForm.module.css';
import type { Option } from '@/types/filter';
import { useFiltersStore } from '@/lib/store/useFiltersStore';
import { useSearchStore } from '@/lib/store/useSearchStore';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import { useResetAll } from '@/lib/store/useResetAll';

type FiltersFormProps = {
  categories: Option[];
  ingredients: Option[];
};

export function FiltersForm({ categories, ingredients }: FiltersFormProps) {
  const category = useFiltersStore((s) => s.category);
  const ingredient = useFiltersStore((s) => s.ingredient);
  const setCategory = useFiltersStore((s) => s.setCategory);
  const setIngredient = useFiltersStore((s) => s.setIngredient);

  const resetAll = useResetAll();

  return (
    <div className={css.inputResetWrapper}>
      <div className={css.filterFieldsWrapper}>
        {/* Category */}
        <div className={css.filtersField}>
          <CustomSelect
            name="Category"
            placeholder="Category"
            value={category}
            options={categories}
            onChange={setCategory}
          />
        </div>

        {/* Ingredient */}
        <div className={css.filtersField}>
          <CustomSelect
            name="Ingredient"
            placeholder="Ingredient"
            value={ingredient}
            options={ingredients}
            onChange={setIngredient}
          />
        </div>
      </div>

      <button type="button" className={css.resetButton} onClick={resetAll}>
        Reset filters
      </button>
    </div>
  );
}
