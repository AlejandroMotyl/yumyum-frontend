import { create } from 'zustand';

interface FilterState {
  category: string;
  ingredient: string;
  setCategory: (value: string) => void;
  setIngredient: (value: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FilterState>((set) => ({
  category: '',
  ingredient: '',
  setCategory: (value) => set({ category: value }),
  setIngredient: (value) => set({ ingredient: value }),
  resetFilters: () => set({ category: '', ingredient: '' }),
}));
