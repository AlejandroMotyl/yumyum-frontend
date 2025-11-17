'use client';

import { useEffect, useState } from 'react';
import css from './Filters.module.css';
import type { Option } from '@/types/filter';
import { FiltersForm } from '../FiltersForm/FiltersForm';
import { FiltersModal } from '../FiltersModal/FiltersModal';

//! Temp comments to return props when needed
// type FiltersProps = {
//   totalRecipes: number;
//   categories: Option[];
//   ingredients: Option[];
// };

// {
//   totalRecipes,
//   categories,
//   ingredients,
// }: FiltersProps

export default function Filters() {
  const totalRecipes = 'xx'; //! Replace with dynamic data fetch later

  const [categoriesOptions, setCategoriesOptions] = useState<Option[]>([]);
  const [ingredientsOptions, setIngredientsOptions] = useState<Option[]>([]);

  useEffect(() => {
    async function loadFilters() {
      try {
        // fetch categories
        const catRes = await fetch('/api/categories');
        const categoriesJson = await catRes.json();

        // fetch ingredients
        const ingRes = await fetch('/api/ingredients');
        const ingredientsJson = await ingRes.json();

        // map to option[]
        setCategoriesOptions(
          categoriesJson.map((item: any) => ({
            value: item.name,
            label: item.name,
          })),
        );

        setIngredientsOptions(
          ingredientsJson.map((item: any) => ({
            value: item.name,
            label: item.name,
          })),
        );
      } catch (e) {
        console.error('Failed to load filter data:', e);
      }
    }

    loadFilters();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={css.filtersSection}>
      <div>
        <div className={css.filtersWrapper}>
          <p className={css.totalRecipes}>{totalRecipes} recipes</p>

          {/* mobile toggle */}
          <button
            className={css.filtersToggle}
            type="button"
            onClick={() => setIsOpen(true)}
          >
            <span>Filters</span>
            <svg width="24" height="24">
              <use href="/Sprite.svg#icon-Mailfilter" />
            </svg>
          </button>
          {/* desktop inline form */}
          <div className={css.desktopFiltersPanel}>
            <FiltersForm
              categories={categoriesOptions}
              ingredients={ingredientsOptions}
            />
          </div>
        </div>
      </div>

      {/* mobile modal */}
      <FiltersModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={categoriesOptions}
        ingredients={ingredientsOptions}
      />
    </section>
  );
}
