'use client';

import css from './FiltersForm.module.css';
import type { Option } from '@/types/filter';
import { useFiltersStore } from '@/lib/store/useFiltersStore';
import { useSearchStore } from '@/lib/store/useSearchStore';
import { CustomSelect } from '../CustomSelect/CustomSelect';

type FiltersFormProps = {
  categories: Option[];
  ingredients: Option[];
  onAfterReset?: () => void;
};

export function FiltersForm({
  categories,
  ingredients,
  onAfterReset,
}: FiltersFormProps) {
  const category = useFiltersStore((s) => s.category);
  const ingredient = useFiltersStore((s) => s.ingredient);
  const setCategory = useFiltersStore((s) => s.setCategory);
  const setIngredient = useFiltersStore((s) => s.setIngredient);
  const resetFilters = useFiltersStore((s) => s.resetFilters);
  const clearSearchQuery = useSearchStore((s) => s.clearSearchQuery);

  const handleReset = () => {
    resetFilters();
    clearSearchQuery();
    onAfterReset?.();
  };

  return (
    <div className={css.inputResetWrapper}>
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

      <button type="button" className={css.resetButton} onClick={handleReset}>
        Reset filters
      </button>
    </div>
  );
}

// return (
//     <div className={css.inputResetWrapper}>
//       <label className={css.filtersField}>
//         <select value={category} onChange={(e) => setCategory(e.target.value)}>
//           <option value="" disabled hidden>
//             Category
//           </option>
//           {categories.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//       </label>

//       <label className={css.filtersField}>
//         <select
//           value={ingredient}
//           onChange={(e) => setIngredient(e.target.value)}
//         >
//           <option value="" disabled hidden>
//             Ingredient
//           </option>
//           {ingredients.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//       </label>

//       <button type="button" className={css.resetButton} onClick={handleReset}>
//         Reset filters
//       </button>
//     </div>
//   );
