import { create } from 'zustand';
import { User } from '@/types/user';

export interface AuthProps {
  user: User | null;
  isAuthenticated: boolean;
  savedRecipes: string[];

  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  addSavedRecipe: (id: string) => void;
  removeSavedRecipe: (id: string) => void;
}

export const useAuthStore = create<AuthProps>()((set) => ({
  user: null,
  isAuthenticated: false,
  savedRecipes: [],

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearIsAuthenticated: () =>
    set({
      user: null,
      isAuthenticated: false,
      savedRecipes: [],
    }),

  addSavedRecipe: (id) =>
    set((state) => ({
      savedRecipes: state.savedRecipes.includes(id)
        ? state.savedRecipes
        : [...state.savedRecipes, id],
    })),

  removeSavedRecipe: (id) =>
    set((state) => ({
      savedRecipes: state.savedRecipes.filter((recipeId) => recipeId !== id),
    })),
}));
