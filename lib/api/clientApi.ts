import { User, RegisterData, LoginData } from '@/types/user';
import { api } from './api';
import { Recipe, RecipeFavorite } from '@/types/recipe';
import { getCategoriesProps, getIngredientsProps } from '@/types/filter';

interface CheckSessionRequest {
  success: boolean;
}

export const checkSession = async () => {
  const { data } = await api.post<CheckSessionRequest>('/auth/session', {});
  return data.success;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('/current');
  return data;
};

export const logout = async (): Promise<void> => {
  const { data } = await api.post<void>('/auth/logout');
  return data;
};

export const register = async (credentials: RegisterData) => {
  const { data } = await api.post<User>('/auth/register', credentials);
  return data;
};

export const login = async (credentials: LoginData) => {
  const { data } = await api.post<User>('/auth/login', credentials);
  return data;
};

// ========== RECIPES ==========

export const getAllRecipes = async (params: {
  page?: string | null;
  perPage?: string;
  category?: string | null;
  search?: string | null;
  ingredient?: string | null;
}): Promise<{
  recipes: Recipe[];
  totalPages: number;
  totalRecipes: number;
}> => {
  const { perPage = 12, page = 1, ...rest } = params;

  const { data } = await api.get(`/recipes`, {
    params: {
      perPage,
      page,
      ...rest,
    },
  });
  return data;
};

export const getRecipeById = async (recipeId: string): Promise<Recipe> => {
  const { data } = await api.get<Recipe>(`/recipes/${recipeId}`);
  return data;
};
// ========== FILTERS ==========

export const getCategories = async (): Promise<getCategoriesProps[]> => {
  const { data } = await api.get('/categories');
  return data;
};

export const getIngredients = async (): Promise<getIngredientsProps[]> => {
  const { data } = await api.get('/ingredients');
  return data;
};

// ========== FAVORITES ==========

export const getFavoriteRecipes = async (params: {
  page?: string | null;
  perPage?: string;
}): Promise<{
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: RecipeFavorite[];
}> => {
  const { perPage = 12, page = 1 } = params;

  const { data } = await api.get(`/recipes/favorites`, {
    params: {
      perPage,
      page,
    },
  });
  return data;
};

// Добавить рецепт в избранное

export const addFavoriteRecipe = async (
  recipeId: string,
): Promise<{ message: string }> => {
  const { data } = await api.post(`/recipes/favorites/${recipeId}`);
  return data;
};

// Удалить рецепт из избранного

export const removeFavoriteRecipe = async (
  recipeId: string,
): Promise<{ message: string }> => {
  const { data } = await api.delete(`/recipes/favorites/${recipeId}`);
  return data;
};

// Создать новый рецепт (если нужно будет)

export const createRecipe = async (
  recipeData: Partial<Recipe>,
): Promise<Recipe> => {
  const { data } = await api.post('/recipes', recipeData);
  return data;
};

// Удалить собственный рецепт (если нужно будет)

export const deleteOwnRecipe = async (
  recipeId: string,
): Promise<{ message: string }> => {
  const { data } = await api.delete(`/recipes/${recipeId}`);
  return data;
};

export const getOwnRecipes = async (params: {
  page?: string | null;
  perPage?: string;
}): Promise<{
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: Recipe[];
}> => {
  const { perPage = 12, page = 1 } = params;

  const { data } = await api.get(`/recipes/own`, {
    params: {
      perPage,
      page,
    },
  });
  return data;
};
