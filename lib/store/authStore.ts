import { create } from 'zustand';
import { User } from '@/types/user';

export interface AuthProps {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  addSavedRecipe: (id: string) => void;
  removeSavedRecipe: (id: string) => void;
}

export const useAuthStore = create<AuthProps>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearIsAuthenticated: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  addSavedRecipe: (id) =>
    set((state) => {
      if (!state.user) {
        return state;
      }
      return {
        user: {
          ...state.user,
          savedRecipes: state.user.savedRecipes.includes(id)
            ? state.user.savedRecipes
            : [...state.user.savedRecipes, id],
        },
      };
    }),

  removeSavedRecipe: (id) =>
    set((state) => {
      if (!state.user) {
        return state;
      }

      return {
        user: {
          ...state.user,
          savedRecipes: state.user.savedRecipes.filter(
            (recipeId) => recipeId !== id,
          ),
        },
      };
    }),
}));
