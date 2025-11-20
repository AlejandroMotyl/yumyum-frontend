'use client';

import { useEffect, useRef, useState } from 'react';
import css from './Filters.module.css';
import type { Option } from '@/types/filter';
import { FiltersForm } from '../FiltersForm/FiltersForm';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getIngredients } from '@/lib/api/clientApi';

export default function Filters({ totalRecipes }: { totalRecipes: number }) {
  const { data: categoriesJson, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: ingredientsJson, isLoading: ingLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  });

  // Map to <option>[]
  const categoriesOptions: Option[] =
    categoriesJson?.map((item) => ({
      value: item.name,
      label: item.name,
    })) ?? [];

  const ingredientsOptions: Option[] =
    ingredientsJson?.map((item) => ({
      value: item._id,
      label: item.name,
    })) ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <section className={css.filtersSection}>
      <div className={css.filtersWrapper}>
        <div className={css.filtersHeader}>
          <p className={css.totalRecipes}>{totalRecipes} recipes</p>

          <button
            ref={buttonRef}
            className={css.filtersToggle}
            type="button"
            onClick={handleToggle}
          >
            <span>Filters</span>
            <svg width="24" height="24">
              {isOpen ? (
                <use href="/Sprite-new.svg#icon-close-circle-medium" />
              ) : (
                <use href="/Sprite-new.svg#icon-filter-medium" />
              )}
            </svg>
          </button>
        </div>

        <div
          ref={panelRef}
          className={`${css.filtersPanel}  ${isOpen ? css.filtersPanelOpen : ''}`}
        >
          <FiltersForm
            categories={categoriesOptions}
            ingredients={ingredientsOptions}
          />
        </div>
      </div>
    </section>
  );
}
