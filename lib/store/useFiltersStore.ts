import { create } from 'zustand';

interface FilterState {
  category: string;
  ingredient: string;
  sort: string;
  setCategory: (value: string) => void;
  setIngredient: (value: string) => void;
  setSort: (value: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FilterState>((set) => ({
  category: '',
  ingredient: '',
  sort: 'popularity',
  setCategory: (value) => set({ category: value }),
  setIngredient: (value) => set({ ingredient: value }),
  setSort: (value) => set({ sort: value }),

  resetFilters: () => set({ category: '', ingredient: '', sort: 'popularity' }),
}));
