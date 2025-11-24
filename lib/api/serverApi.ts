import { cookies } from 'next/headers';
import { api } from './api';
import { Recipe, RecipeFavorite } from '@/types/recipe';
export const checkServerSession = async () => {
  const cookieStore = await cookies();
  return await api.post(
    `/auth/session`,
    {},
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );
};

export const getFavoriteRecipes = async (params: {
  page?: string | null;
  perPage?: string;
  category?: string | null;
  ingredient?: string | null;
}): Promise<{
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: RecipeFavorite[];
}> => {
  const cookieStore = await cookies();
  const { perPage = 12, page = 1, ...rest } = params;
  const { data } = await api.get(`/recipes/favorites`, {
    params: {
      perPage,
      page,
      ...rest,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const getOwnRecipes = async (params: {
  page?: string | null;
  perPage?: string;
  category?: string | null;

  ingredient?: string | null;
}): Promise<{
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: Recipe[];
}> => {
  const cookieStore = await cookies();
  const { perPage = 12, page = 1, ...rest } = params;

  const { data } = await api.get(`/recipes/own`, {
    params: {
      perPage,
      page,
      ...rest,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
