import { User, RegisterData } from '@/types/user';
import { api } from './api';
import { Recipe } from '@/types/recipe';

interface CheckSessionRequest {
  success: boolean;
}

export const checkSession = async () => {
  const { data } = await api.get<CheckSessionRequest>('/auth/session');
  return data.success;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/current');
  return data;
};
export const logout = async (): Promise<void> => {
  const { data } = await api.post<void>('/auth/logout');
  return data;
};

export interface AuthResponse {
  user: User;
  token: string;
}
export const register = async (credentials: RegisterData) => {
  const { data } = await api.post<AuthResponse>('/auth/register', credentials);
  return data;
};

export const getAllRecipes = async (
  page: number,
  perPage: number,
): Promise<Recipe[]> => {
  const { data } = await api.get(`/recipes?page=${page}&perPage=${perPage}`);
  return data.recipes ?? data;
};
